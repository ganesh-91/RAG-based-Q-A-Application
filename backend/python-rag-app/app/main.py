# main.py

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.documents import router as documents_router
from app.api.qa import router as qa_router
from app.services.kafka_service import KafkaService

logger = logging.getLogger(__name__)
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(documents_router, prefix="/api")
app.include_router(qa_router, prefix="/api")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}  # Or return more detailed health information

# Initialize Kafka service
kafka_service = KafkaService()

@app.on_event("startup")
async def startup_event():
    """
    Start the Kafka service when the application starts.
    """
    logging.basicConfig(level=logging.INFO)
    kafka_service.start()
    logger.info("Kafka service started.")

@app.on_event("shutdown")
async def shutdown_event():
    """
    Stop the Kafka service when the application shuts down.
    """
    kafka_service.stop()
    logger.info("Kafka service stopped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)