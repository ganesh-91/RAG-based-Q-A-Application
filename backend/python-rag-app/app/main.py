# main.py

from fastapi import FastAPI
from app.api.documents import router as documents_router
from app.api.search import router as search_router

app = FastAPI()

app.include_router(documents_router, prefix="/api")
app.include_router(search_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)