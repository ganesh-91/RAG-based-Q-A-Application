from fastapi import APIRouter, HTTPException
from app.services.document_service import DocumentService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()
document_service = DocumentService()

@router.post("/ingest/")
async def ingest_document(path: str):
    try:
        await document_service.ingest_document(path, 'path.pdf')
        return {"message": "Document ingested successfully"}
    except Exception as e:
        logger.error(f"Failed to ingest document due to exception: {e}")
        raise HTTPException(status_code=500, detail=str(e))