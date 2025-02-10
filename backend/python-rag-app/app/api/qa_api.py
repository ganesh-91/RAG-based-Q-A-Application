from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ingestion_service import DocumentService
from app.services.qa_service import QAService

router = APIRouter()

document_service = DocumentService()
qa_service = QAService(document_service.vector_store)


class QueryModel(BaseModel):
    query: str

@router.post("/ask")
async def ask_question(query: QueryModel):
    try:
        return qa_service.ask_question(query.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))