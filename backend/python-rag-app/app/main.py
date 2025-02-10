from fastapi import FastAPI
from app.api.ingestion_api import router as ingestion_router
from app.api.qa_api import router as qa_router

app = FastAPI()

app.include_router(ingestion_router, prefix="/api/ingestion", tags=["ingestion"])
app.include_router(qa_router, prefix="/api/qa", tags=["qa"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Document Management and RAG-based Q&A App!"}