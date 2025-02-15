from fastapi import FastAPI
from app.api.ingestion_api import router as ingestion_router
from app.api.qa_api import router as qa_router
from app.api.document_selection_api import router as document_selection_router

app = FastAPI()

app.include_router(ingestion_router, prefix="/api")
app.include_router(qa_router, prefix="/api")
app.include_router(document_selection_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Document Management and RAG-based Q&A App!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)