from pydantic import BaseModel


class Candidate(BaseModel):
    enrollee_id: int
    city: str
    city_development_index: float
    gender: str | None = None
    relevent_experience: str | None = None
    enrolled_university: str | None = None
    education_level: str | None = None
    major_discipline: str | None = None
    experience: str | None = None
    company_size: str | None = None
    company_type: str | None = None
    last_new_job: str | None = None
    training_hours: float


class ChurnResult(BaseModel):
    enrollee_id: int
    churn: int
