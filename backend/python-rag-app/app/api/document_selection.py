# app/api/document_selection.py
from fastapi import APIRouter, HTTPException
# from app.services.postgres_service import save_embedding

router = APIRouter()

@router.post("/select")
async def select_documents(document_paths: list):
    try:
        # for path in document_paths:
            # save_embedding(path, None)  # Update the selection logic as needed
        return {"message": "Documents selected successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))