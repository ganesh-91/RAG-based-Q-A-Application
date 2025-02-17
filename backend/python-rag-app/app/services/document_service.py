import os
import logging
import json
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_unstructured import UnstructuredLoader
from langchain_postgres import PGVector
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv
from typing import List, Dict, Optional, Any
from app.utils.config import Config
from sentence_transformers import SentenceTransformer

import psycopg2

logger = logging.getLogger(__name__)


load_dotenv()

class DocumentService:
    def __init__(self):
        self.model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        # self.model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
        self.connection_string = Config.POSTGRES_URL
        self.db_connection = psycopg2.connect(self.connection_string)  # Pass db config like 'dbname', 'user', 'password', 'host', etc.
        self.db_cursor = self.db_connection.cursor()
        
        self.engine = create_engine(self.connection_string)

        self.collection_name = "document_embeddings"
        self.vector_store = PGVector(
            collection_name=self.collection_name,
            connection=self.engine,
            embeddings=self.model,
        )

        print(self.engine)

    def load_document(self, file_path: str):
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".doc") or file_path.endswith(".docx"):
            loader = UnstructuredLoader(file_path)
        else:
            raise ValueError("Unsupported file format")
        return loader.load()

    def ingest_document(self, file_path: str):
        logger.info(f"E[ENTRY]")
        try:
            documents = self.load_document(file_path)
            filename = file_path.split('/')[-1]
            if not documents:
                return {"message": "No document available to process"}
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
            chunks = text_splitter.split_documents(documents)
            
            # Generate embeddings for each chunk
            embeddings = []
            for chunk in chunks:
                embedding = self.model.embed_query(chunk.page_content)
                embeddings.append(embedding)
            
            # Store embeddings in the database
            for embedding in embeddings:
                self._store_embeddings_in_db(filename, embedding)

            return {"message": "File ingested successfully and embeddings stored in the database"}
        except Exception as e:
            logger.error(f"Failed to ingest document due to exception: {e}")
            return {"message": "Failed to ingest document", "error": str(e)}

    def _store_embeddings_in_db(self, filename: str, embedding: List[float]):
        try:
            query = """
                INSERT INTO document_embeddings (filename, embedding)
                VALUES (%s, %s)
            """
            self.db_cursor.execute(query, (filename, embedding))
            self.db_connection.commit()
            logger.info(f"Embedding stored in database for chunk from {filename}")
        except Exception as e:
            logger.error(f"Failed to store embedding in database: {e}")
            raise

if __name__ == "__main__":
    document_service = DocumentService()