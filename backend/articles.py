import json
import os
import hashlib
import random
from typing import List, Dict

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "articles.json")

# 카테고리당 배정 수
N_PER_CATEGORY = 3


def load_articles() -> List[Dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def assign_articles(participant_id: str) -> List[Dict]:
    """
    4개 카테고리(사회-진보, 사회-보수, 경제-진보, 경제-보수)에서
    각 3개씩 총 12개를 층화 무작위 배정.
    같은 participant_id는 항상 동일한 기사를 배정받음.
    """
    articles = load_articles()

    categories = [
        ("social",   "progressive"),
        ("social",   "conservative"),
        ("economic", "progressive"),
        ("economic", "conservative"),
    ]

    seed = int(hashlib.md5(participant_id.encode()).hexdigest(), 16) % (2**32)
    rng = random.Random(seed)

    selected: List[Dict] = []
    for domain, version in categories:
        pool = [a for a in articles if a["domain"] == domain and a["version"] == version]
        n = min(N_PER_CATEGORY, len(pool))
        selected.extend(rng.sample(pool, n))

    rng.shuffle(selected)
    return selected
