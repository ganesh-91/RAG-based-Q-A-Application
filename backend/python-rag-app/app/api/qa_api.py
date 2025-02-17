from fastapi import APIRouter, HTTPException
from app.models.document_model import Question
from app.services.document_service import DocumentService
from app.services.qa_service import QAService

router = APIRouter()
document_service = DocumentService()
qa_service = QAService(document_service.vector_store)

@router.post("/ask/")
async def ask_question(question: str):
    try:
        answer = await qa_service.answer_question(question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))