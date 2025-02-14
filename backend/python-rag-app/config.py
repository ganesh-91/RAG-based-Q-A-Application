import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")  # Postgres connection string
RABBITMQ_URL = os.getenv("RABBITMQ_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Choose your embedding model
EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2"

# RabbitMQ queue name
INGESTION_QUEUE = "ingestion_queue"
INGESTION_RESULT_QUEUE = "ingestion_queue_result"

# FAISS index file path
FAISS_INDEX_FILE = "faiss_index.bin"