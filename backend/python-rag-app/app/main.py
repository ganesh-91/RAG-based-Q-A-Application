# main.py

import logging
# app/main.py
from fastapi import FastAPI
from app.api.document_ingestion import router as ingestion_router
from app.api.qa import router as qa_router
from app.api.document_selection import router as selection_router

app = FastAPI()

app.include_router(ingestion_router, prefix="/api/v1/ingest", tags=["ingestion"])
app.include_router(qa_router, prefix="/api/v1/qa", tags=["qa"])
app.include_router(selection_router, prefix="/api/v1/select", tags=["selection"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

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

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)