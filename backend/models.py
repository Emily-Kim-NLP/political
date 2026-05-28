from pydantic import BaseModel
from typing import Optional


class ParticipantPayload(BaseModel):
    participant_id: str
    age: str
    grade: str
    major: str
    phone: str
    gender: str
    us_interest_level: int
    consent: bool


class ResponsePayload(BaseModel):
    participant_id: str
    article_id: str
    domain: str
    version: str
    q1_label: str
    q2_sentence: int
    q3_bi: str
    q3_other: Optional[str] = None


class LikertPayload(BaseModel):
    participant_id: str
    answers: dict[str, int]   # e.g. {"soc_1": 3, "eco_2": 5, ...}


class AnalyzePayload(BaseModel):
    participant_id: str
    responses: list[ResponsePayload]
