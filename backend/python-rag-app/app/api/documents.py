# api/documents.py
from typing import List, Dict, Optional, Any
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import DocumentIngestRequest
from app.services.document_service import DocumentService

router = APIRouter()
document_service = DocumentService()

@router.post("/ingest")
async def ingest_document(path: str):
    try:
        await document_service.ingest_docs(path, 'path.pdf')
        return {"message": "Document ingested successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents")
async def get_documents():
    return document_service.get_documents()

@router.delete("/documents")
async def delete_documents(path: str):
    return document_service.delete_documents([path])