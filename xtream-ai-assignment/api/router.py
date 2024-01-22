from fastapi import APIRouter

from .classification_provider import ClassificationProvider
from .models import Candidate, ChurnResult

router = APIRouter(
    prefix="/api/v1",
    responses={404: {"description": "Not found"}, 200: {"description": "Ok"}},
)


@router.post("/candidate:churn", status_code=200)
def candidate_churn(candidates: list[Candidate]) -> list[ChurnResult]:
    return ClassificationProvider.classify(candidates)
