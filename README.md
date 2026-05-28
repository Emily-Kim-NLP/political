# 뉴스 기사 이념 판단 실험 시스템

## 사전 준비

### Google Sheets 서비스 계정 설정
1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 → JSON 키 다운로드 → `backend/credentials.json`으로 저장
4. Google Sheets에서 새 스프레드시트 생성
5. 스프레드시트 URL에서 ID 복사 (`/d/` 와 `/edit` 사이의 문자열)
6. 스프레드시트를 서비스 계정 이메일에 편집자 권한으로 공유
7. `backend/.env`의 `SPREADSHEET_ID` 값 수정

---

## 백엔드 실행

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속

---

## 프로젝트 구조

```
experiment/
├── backend/
│   ├── main.py          # FastAPI 앱, 엔드포인트
│   ├── sheets.py        # Google Sheets 저장 (비동기)
│   ├── models.py        # Pydantic 모델
│   ├── articles.py      # 기사 로드 및 층화 무작위 배정
│   ├── credentials.json # (직접 추가) Google 서비스 계정 키
│   ├── .env             # SPREADSHEET_ID, ALLOWED_ORIGINS
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── ArticlePanel.jsx   # 기사 본문 + Q2 문장 클릭
│   │       ├── QuestionPanel.jsx  # Q1/Q2/Q3 질문 패널
│   │       └── StepIndicator.jsx  # 3단계 진행 표시
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── data/
    └── articles.json    # 기사 데이터 (배열, article_id / domain / version / sentences)
```

---

## API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/health` | 서버 상태 확인 |
| GET | `/session` | 세션 ID 발급 + 기사 10개 배정 |
| POST | `/response` | 응답 1건 Google Sheets에 저장 |

### POST /response 바디
```json
{
  "participant_id": "abc12345",
  "article_id": "E001_prog",
  "domain": "economic",
  "version": "progressive",
  "q1_label": "progressive",
  "q2_sentence": 3,
  "q3_bi": "BI2",
  "q3_other": null
}
```

---

## 기사 추가

`data/articles.json`에 아래 형식으로 추가:

```json
{
  "article_id": "고유ID",
  "domain": "social | economic",
  "version": "progressive | conservative",
  "sentences": [
    { "id": 1, "text": "문장 내용" },
    { "id": 2, "text": "문장 내용" }
  ]
}
```

현재 포함된 기사: 진보 8개 / 보수 8개 (총 16개)  
참여자 1인당 진보 5개 + 보수 5개 = 10개 무작위 배정

---

## 동시 접속

- FastAPI + uvicorn(async) 기반으로 동시 요청 처리
- Google Sheets 쓰기는 ThreadPoolExecutor(max_workers=5)로 비동기 처리
- 같은 participant_id는 항상 동일한 기사 배정 (MD5 시드)
- 대규모 동시 접속 시 세션 저장소를 Redis로 교체 권장
