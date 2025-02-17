# app/api/search.py
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import SearchRequest, DocumentResponse
from app.services.document_service import DocumentService
from app.services.qa_service import QAService
from pydantic import BaseModel

router = APIRouter()
document_service = DocumentService()
qa_service = QAService(document_service.vectorstore)

class QueryModel(BaseModel):
    query: str

@router.post("/ask")
async def ask_question(query: QueryModel):
    try:
        return qa_service.ask_question(query.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))