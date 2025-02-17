# main.py

import logging
from fastapi import FastAPI
from app.api.document_api import router as document_router
from app.api.qa_api import router as qa_router
from app.services.kafka_service import KafkaService

logger = logging.getLogger(__name__)
app = FastAPI()

app.include_router(document_router, prefix="/document")
app.include_router(qa_router, prefix="/qa")


# Initialize Kafka service
# kafka_service = KafkaService()

# @app.on_event("startup")
# async def startup_event():
#     """
#     Start the Kafka service when the application starts.
#     """
#     logging.basicConfig(level=logging.INFO)
#     kafka_service.start()
#     logger.info("Kafka service started.")

# @app.on_event("shutdown")
# async def shutdown_event():
#     """
#     Stop the Kafka service when the application shuts down.
#     """
#     kafka_service.stop()
#     logger.info("Kafka service stopped.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)