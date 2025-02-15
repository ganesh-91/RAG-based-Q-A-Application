from fastapi import APIRouter
from app.services.qa_service import QAService

router = APIRouter()
qa_service = QAService()

@router.post("/qa")
async def answer_question(question: str, document_ids: list[int]):
    return qa_service.answer_question(question, document_ids)