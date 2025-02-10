from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.ingestion_service import DocumentService
import os
import uuid

router = APIRouter()

document_service = DocumentService()

@router.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    try:
        file_extension = os.path.splitext(file.filename)[1]
        file_path = f"uploads/{uuid.uuid4()}{file.filename}{file_extension}"
        os.makedirs("uploads", exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return document_service.ingest_document(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))