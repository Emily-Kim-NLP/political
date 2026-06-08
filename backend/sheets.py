import os
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor

from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SPREADSHEET_ID   = os.getenv("SPREADSHEET_ID")
SCOPES           = ["https://www.googleapis.com/auth/spreadsheets"]
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "credentials.json")

RESPONSE_SHEET    = "responses"
PARTICIPANT_SHEET = "participants"
LIKERT_SHEET      = "likert"

_Q_COLS = ["article_id", "domain", "q1_label", "q2_sentence", "q3_bi", "q3_other", "correct"]
RESPONSE_HEADERS = ["timestamp", "participant_id"] + [
    f"Q{i}_{col}" for i in range(1, 13) for col in _Q_COLS
]
PARTICIPANT_HEADERS = [
    "timestamp", "participant_id", "age", "grade", "major",
    "phone", "gender", "us_interest_level", "consent"
]
LIKERT_HEADERS = [
    "timestamp", "participant_id",
    "soc_1", "soc_2", "soc_3", "soc_4", "soc_5", "soc_6",
    "eco_1", "eco_2", "eco_3", "eco_4", "eco_5", "eco_6",
]

_executor = ThreadPoolExecutor(max_workers=20)
_response_header_ensured    = False
_participant_header_ensured = False
_likert_header_ensured      = False


def _get_service():
    if os.path.exists(CREDENTIALS_FILE):
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=SCOPES
        )
    else:
        creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
        if not creds_json:
            raise RuntimeError("credentials.json not found and GOOGLE_CREDENTIALS_JSON env var not set")
        creds = service_account.Credentials.from_service_account_info(
            json.loads(creds_json), scopes=SCOPES
        )
    return build("sheets", "v4", credentials=creds)


def _create_sheet_if_missing(service, sheet_name: str):
    spreadsheet = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
    existing = [s["properties"]["title"] for s in spreadsheet["sheets"]]
    if sheet_name not in existing:
        service.spreadsheets().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body={"requests": [{"addSheet": {"properties": {"title": sheet_name}}}]},
        ).execute()


def _ensure_sheet_header_sync(sheet_name: str, headers: list[str]):
    service = _get_service()
    _create_sheet_if_missing(service, sheet_name)
    result = (
        service.spreadsheets().values()
        .get(spreadsheetId=SPREADSHEET_ID, range=f"{sheet_name}!A1:Z1")
        .execute()
    )
    if not result.get("values"):
        service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{sheet_name}!A1",
            valueInputOption="RAW",
            body={"values": [headers]},
        ).execute()


def _append_row_sync(sheet_name: str, row: list):
    service = _get_service()
    service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=f"{sheet_name}!A1",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body={"values": [row]},
    ).execute()


# ── Response sheet ────────────────────────────────────────────────

def _ensure_response_header_sync():
    global _response_header_ensured
    if _response_header_ensured:
        return
    _ensure_sheet_header_sync(RESPONSE_SHEET, RESPONSE_HEADERS)
    _response_header_ensured = True


async def ensure_header():
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _ensure_response_header_sync)


async def append_response(row: list):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _append_row_sync, RESPONSE_SHEET, row)


# ── Participant sheet ─────────────────────────────────────────────

def _ensure_participant_header_sync():
    global _participant_header_ensured
    if _participant_header_ensured:
        return
    _ensure_sheet_header_sync(PARTICIPANT_SHEET, PARTICIPANT_HEADERS)
    _participant_header_ensured = True


async def ensure_participant_header():
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _ensure_participant_header_sync)


async def append_participant(row: list):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _append_row_sync, PARTICIPANT_SHEET, row)


# ── Likert sheet ──────────────────────────────────────────────────

def _ensure_likert_header_sync():
    global _likert_header_ensured
    if _likert_header_ensured:
        return
    _ensure_sheet_header_sync(LIKERT_SHEET, LIKERT_HEADERS)
    _likert_header_ensured = True


async def ensure_likert_header():
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _ensure_likert_header_sync)


async def append_likert(row: list):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(_executor, _append_row_sync, LIKERT_SHEET, row)
