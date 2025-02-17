# app/utils/config.py
import os

class Config:
    KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
    KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "document_ingestion")
    RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:1234@localhost:5432/rag_db")
    EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"