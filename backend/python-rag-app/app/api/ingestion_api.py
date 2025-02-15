from fastapi import APIRouter
from app.services.ingestion_service import IngestionService
import chardet
from config import INGESTION_QUEUE
from app.utils.rabbitmq import RabbitMQ

router = APIRouter()
ingestion_service = IngestionService()
rabbitmq_service = RabbitMQ(INGESTION_QUEUE)

@router.post("/ingest")
async def ingest_document(file_path: str):
    message = {"doc_path": file_path}
    ingestion_service.ingest_document(file_path)
    rabbitmq_service.send_message(message, INGESTION_QUEUE) # Send message to RabbitMQ
    return {"message": "Ingestion task added to queue."} # Return immediately
    # return await ingestion_service.ingest_document(file_path)