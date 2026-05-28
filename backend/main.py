import uuid
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from openai import AsyncOpenAI
import os

from models import ParticipantPayload, ResponsePayload, LikertPayload, AnalyzePayload
from sheets import (
    ensure_header, append_response,
    ensure_participant_header, append_participant,
    ensure_likert_header, append_likert,
)
from articles import assign_articles

load_dotenv()

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
GPT_MODEL = "gpt-5.4"

app = FastAPI()
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

BI_LABELS = {
    "BI1": "자극적·평가적 단어",
    "BI2": "해석의 사실화",
    "BI3": "특정 인물·정책 묘사",
    "BI4": "한쪽 입장 강조",
    "BI5": "편향된 인용",
    "BI6": "선택적 사실 제시",
    "기타": "기타",
}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/session")
def create_session():
    participant_id = str(uuid.uuid4())[:8]
    articles = assign_articles(participant_id)
    return {"participant_id": participant_id, "articles": articles}


@app.post("/participant")
async def save_participant(payload: ParticipantPayload):
    try:
        await ensure_participant_header()
        row = [
            datetime.now(timezone.utc).isoformat(),
            payload.participant_id,
            payload.age,
            payload.grade,
            payload.major,
            payload.phone,
            payload.gender,
            payload.us_interest_level,
            "동의" if payload.consent else "비동의",
        ]
        await append_participant(row)
        return {"status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/likert")
async def save_likert(payload: LikertPayload):
    try:
        await ensure_likert_header()
        question_ids = [
            "soc_1","soc_2","soc_3","soc_4","soc_5","soc_6",
            "eco_1","eco_2","eco_3","eco_4","eco_5","eco_6",
        ]
        row = [
            datetime.now(timezone.utc).isoformat(),
            payload.participant_id,
        ] + [payload.answers.get(qid, "") for qid in question_ids]
        await append_likert(row)
        return {"status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/response")
async def save_response(payload: ResponsePayload):
    try:
        await ensure_header()
        row = [
            datetime.now(timezone.utc).isoformat(),
            payload.participant_id,
            payload.article_id,
            payload.domain,
            payload.version,
            payload.q1_label,
            payload.q2_sentence,
            payload.q3_bi,
            payload.q3_other or "",
        ]
        await append_response(row)
        return {"status": "saved"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze")
async def analyze_responses(payload: AnalyzePayload):
    try:
        lines = []
        correct = 0
        bi_counts: dict[str, int] = {}

        for i, r in enumerate(payload.responses, 1):
            perceived = "보수" if r.q1_label == "conservative" else "진보"
            actual    = "보수" if r.version  == "conservative" else "진보"
            match     = "✓ 일치" if r.q1_label == r.version else "✗ 불일치"
            bi_label  = BI_LABELS.get(r.q3_bi, r.q3_bi)
            bi_counts[bi_label] = bi_counts.get(bi_label, 0) + 1
            if r.q1_label == r.version:
                correct += 1
            lines.append(
                f"{i}. 기사 {r.article_id} | 실제:{actual} → 인식:{perceived} ({match}) | "
                f"선택 문장:{r.q2_sentence}번 | 판단 근거:{bi_label}"
            )

        top_bi = sorted(bi_counts.items(), key=lambda x: -x[1])
        top_bi_str = ", ".join(f"{k}({v}회)" for k, v in top_bi[:3])
        summary = "\n".join(lines)

        prompt = f"""당신은 미디어 편향 연구자입니다. 아래는 실험 참여자 {payload.participant_id}의 뉴스 기사 이념 성향 판단 실험 응답입니다.

총 {len(payload.responses)}개 기사 중 {correct}개({correct/len(payload.responses)*100:.0f}%)를 정확히 분류했습니다.
가장 자주 선택한 판단 근거: {top_bi_str}

응답 상세:
{summary}

위 결과를 바탕으로 참여자의 이념 성향 인식 패턴을 한국어로 3~4문장으로 분석해 주세요.
정확도, 주요 판단 단서 유형, 특이한 패턴 등을 포함하세요. 연구자가 참고할 수 있는 간결한 분석으로 작성해 주세요."""

        response = await openai_client.chat.completions.create(
            model=GPT_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=400,
            temperature=0.7,
        )
        analysis_text = response.choices[0].message.content or "분석 결과를 불러올 수 없습니다."
        return {"analysis": analysis_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Static files — must be registered last so API routes take priority
if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
