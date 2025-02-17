# app/api/qa.py
from fastapi import APIRouter, HTTPException
from app.services.rag_service import RagService
from app.services.document_service import DocumentService

router = APIRouter()

document_service = DocumentService()
rag_service = RagService(document_service.vector_store)

document_service = DocumentService()

@router.post("/ask")
async def ask_question(question: str):
    try:
        answer = rag_service.answer_question(question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))