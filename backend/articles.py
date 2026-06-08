import json
import os
import hashlib
import random
import sqlite3
from typing import List, Dict

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "articles.json")
DB_PATH   = os.path.join(os.path.dirname(__file__), "..", "data", "assignment.db")

N_PER_CATEGORY = 3
_FIXED_SEED    = 20250530  # 카테고리 풀 사전 셔플용 고정 시드


def load_articles() -> List[Dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _init_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS category_counters (
            category TEXT PRIMARY KEY,
            value    INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()


def _next_slot(domain: str, version: str) -> int:
    """카테고리별 카운터를 원자적으로 증가시키고 0-인덱스 슬롯 반환."""
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        category = f"{domain}_{version}"
        conn.execute("""
            INSERT INTO category_counters (category, value) VALUES (?, 1)
            ON CONFLICT(category) DO UPDATE SET value = value + 1
        """, (category,))
        conn.commit()
        cursor = conn.execute(
            "SELECT value FROM category_counters WHERE category = ?", (category,)
        )
        return cursor.fetchone()[0] - 1  # 증가 전 값 (0-인덱스)
    finally:
        conn.close()


_init_db()


def assign_articles(participant_id: str) -> List[Dict]:
    """
    순환 무작위 배정 (Cyclic-Random Stratified Assignment):

    1. 각 카테고리 풀을 고정 시드로 미리 셔플 (모든 참여자 공통)
    2. 참여자마다 순서대로 N_PER_CATEGORY개씩 슬롯 배정 (순환)
       → ceil(풀크기 / 3)명이 참여하면 카테고리 내 모든 기사 커버
    3. 최종 12개 순서는 participant_id 기반으로 다시 셔플 (참여자별 랜덤)
    """
    articles = load_articles()

    categories = [
        ("social",   "progressive"),
        ("social",   "conservative"),
        ("economic", "progressive"),
        ("economic", "conservative"),
    ]

    # 참여자별 최종 순서 셔플용 RNG
    p_seed = int(hashlib.md5(participant_id.encode()).hexdigest(), 16) % (2**32)
    p_rng  = random.Random(p_seed)

    selected: List[Dict] = []
    for domain, version in categories:
        pool = [a for a in articles if a["domain"] == domain and a["version"] == version]

        # 고정 시드로 풀 사전 셔플 (카테고리마다 다른 순서, 항상 동일)
        cat_seed = _FIXED_SEED + abs(hash(f"{domain}_{version}")) % (2**16)
        fixed_rng = random.Random(cat_seed)
        shuffled  = pool.copy()
        fixed_rng.shuffle(shuffled)

        # 이 참여자의 순환 슬롯
        slot  = _next_slot(domain, version)
        start = (slot * N_PER_CATEGORY) % len(shuffled)
        picked = [shuffled[(start + i) % len(shuffled)] for i in range(N_PER_CATEGORY)]
        selected.extend(picked)

    p_rng.shuffle(selected)
    return selected
