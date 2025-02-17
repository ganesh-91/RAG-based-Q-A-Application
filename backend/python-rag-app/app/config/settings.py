# config/settings.py

class Settings:
    VECTORSTORE_PATH = "vectorstore.pkl"
    POSTGRES_URL="postgresql+psycopg2://postgres:1234@localhost:5432/rag_db"
    RETRIEVER_TOP_K = 5
    RETRIEVER_SCORE_THRESHOLD = 0.7
    KAFKA_BROKER = "localhost:9092"  # Kafka broker address
    KAFKA_INGEST_TOPIC = "ingestion-trigger"  # Topic for document ingestion requests
    KAFKA_COMPLETED_TOPIC = "ingestion-completed"  # Topic for ingestion completion messages

settings = Settings()