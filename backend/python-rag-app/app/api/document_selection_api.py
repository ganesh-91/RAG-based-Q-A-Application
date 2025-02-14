from fastapi import APIRouter

router = APIRouter()

@router.post("/select-documents")
async def select_documents(document_ids: list[int]):
    return {"selected_documents": document_ids}