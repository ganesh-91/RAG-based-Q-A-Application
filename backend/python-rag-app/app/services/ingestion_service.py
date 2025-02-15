from app.utils.database import SessionLocal, Document
from app.utils.embeddings import EmbeddingGenerator
from app.utils.rabbitmq import RabbitMQ
import os

class IngestionService:
    def __init__(self):
        self.embedding_generator = EmbeddingGenerator()
        self.rabbitmq = RabbitMQ("ingestion-status")

    async def ingest_document(self, file_path: str):
        # Generate embeddings
        try:
            with open(file_path, "r", encoding="utf-8") as file:  # Specify encoding
                text = file.read()
        except UnicodeDecodeError:
            # Fallback to a different encoding if UTF-8 fails
            with open(file_path, "r", encoding="latin-1") as file:
                text = file.read()

        embeddings = self.embedding_generator.generate_embeddings(text)

        # Save to database
        db = SessionLocal()
        document = Document(file_path=file_path, embeddings=embeddings)
        db.add(document)
        db.commit()
        db.refresh(document)
        db.close()

        # Notify via RabbitMQ
        await self.rabbitmq.connect()
        await self.rabbitmq.send_message({"status": "done", "file_path": file_path})
        await self.rabbitmq.close()

        return {"status": "success", "file_path": file_path}