import os
import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_unstructured import UnstructuredLoader
from langchain_postgres import PGVector
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv
from typing import List, Dict, Optional, Any
from app.config.settings import settings
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


load_dotenv()

class DocumentService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        
        self.connection_string = settings.DB_URL
        self.collection_name = "document_embeddings"
        self.engine = create_engine(self.connection_string)
        print(self.engine)
        
        try:
            with self.engine.connect() as connection:
                print("Connection to PostgreSQL successful!")
        except Exception as e:
            print(f"Error connecting to PostgreSQL: {e}")

        # Check if the table exists
        inspector = inspect(self.engine)
        if inspector.has_table(self.collection_name):
            print(f"Table '{self.collection_name}' exists. Loading embeddings...")
            self.vector_store = PGVector(
                collection_name=self.collection_name,
                connection=self.engine,
                embeddings=self.embeddings,
            )
        else:
            print(f"Table '{self.collection_name}' does not exist. Creating new table...")
            self.vector_store = PGVector(
                collection_name=self.collection_name,
                connection=self.engine,
                embeddings=self.embeddings,
            )

    def load_document(self, file_path: str):
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".doc") or file_path.endswith(".docx"):
            loader = UnstructuredLoader(file_path)
        else:
            raise ValueError("Unsupported file format")
        return loader.load()

    async def ingest_document(self, file_path: str, filename: str):
        logger.info(f"E[ENTRY]")
        # document_service.ingest_document(filepath, filename)
        try:
            documents = self.load_document(file_path)
            if not documents:
                return {"message": "No document available to process"}
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
            chunks = text_splitter.split_documents(documents)
            
            # Get text content from chunks
            chunk_texts = [chunk.page_content for chunk in chunks]
            
            # Create embeddings for each chunk
            embeddings = self.model.encode(chunk_texts)
            
            # Store each chunk and its embedding in the database
            for chunk_text, embedding in zip(chunk_texts, embeddings):
                self._store_embeddings_in_db(filename, chunk_text, embedding.tolist())

            # Add to vector store
            self.vector_store.add_documents(chunks)

            return {"message": "File ingested successfully and embeddings stored in the database"}
        except Exception as e:
            logger.error(f"Failed to ingest document due to exception: {e}")
            return {"message": "Failed to ingest document", "error": str(e)}

    def _store_embeddings_in_db(self, filename: str, content: str, embedding: List[float]):
        try:
            query = """
                INSERT INTO document_embeddings (filename, content, embedding)
                VALUES (%s, %s, %s)
            """
            # Convert embedding to a format suitable for your database
            # For PostgreSQL with pgvector, you might need to convert to a specific format
            # For regular PostgreSQL, you might want to store it as JSON or text
            self.db_cursor.execute(query, (
                filename, 
                content, 
                json.dumps(embedding)  # or use appropriate conversion for your database
            ))
            self.db_connection.commit()
            logger.info(f"Embedding stored in database for chunk from {filename}")
        except Exception as e:
            logger.error(f"Failed to store embedding in database: {e}")
            raise

if __name__ == "__main__":
    document_service = DocumentService()