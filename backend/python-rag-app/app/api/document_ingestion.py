# app/api/document_ingestion.py
from fastapi import APIRouter, HTTPException
from app.services.document_service import DocumentService

router = APIRouter()
document_service = DocumentService()

@router.post("/ingest")
async def ingest_document(path: str):
    try:
        document_service.ingest_document(path)
        return {"message": "Document ingested successfully"}
    except Exception as e:
        print(f"Failed to ingest document due to exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))