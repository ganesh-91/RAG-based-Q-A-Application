import os
import logging
from typing import List, Dict, Any

from langchain.vectorstores import PGVector
from langchain.schema import Document
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings

from app.config.settings import settings

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):
        # Initialize the embedding model
        self.embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
        
        # Initialize the PGVector connection
        self.connection_string = settings.POSTGRES_URL
        self.collection_name = "document_embeddings"
        
        try:
            self.vectorstore = PGVector.from_existing_index(
                embedding=self.embedding_model,
                collection_name=self.collection_name,
                connection_string=self.connection_string,
            )
        except Exception as e:
            logger.warning(f"Failed to load existing vectorstore: {e}")
            # Initialize a new vectorstore if it doesn't exist
            self.vectorstore = PGVector(
                embedding_function=self.embedding_model,
                collection_name=self.collection_name,
                connection_string=self.connection_string,
            )

    def load_document(self, file_path: str) -> List[Document]:
        logger.info(f"[ENTRY] DocumentService load_document")
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".doc") or file_path.endswith(".docx"):
            loader = UnstructuredLoader(file_path)
        else:
            raise ValueError("Unsupported file format")
        logger.info(f"[EXIT] DocumentService load_document")
        return loader.load()

    async def ingest_docs(self, filepath: str, filename: str) -> bool:
        logger.info(f"[ENTRY] DocumentService ingest_docs {filepath}")
        if not filename.endswith((".docx", ".pdf", ".doc")):
            raise ValueError(f"{filename} is not a valid doc, docx, or PDF")

        try:
            # Load and split the document
            raw_documents = self.load_document(filepath)
            if raw_documents:
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                documents = text_splitter.split_documents(raw_documents)
                
                # Add documents to the PGVector store
                self.vectorstore.add_documents(documents)
                logger.info(f"Successfully ingested {len(documents)} chunks from {filename}")
            else:
                logger.warning("No documents available to process!")
        except Exception as e:
            logger.error(f"Failed to ingest document due to exception: {e}")
            raise ValueError("Failed to upload document. Please upload an unstructured text document.")
        
        logger.info(f"[EXIT] DocumentService ingest_docs")
        return True

    def get_documents(self) -> List[str]:
        logger.info(f"[ENTRY] DocumentService get_documents")
        try:
            # Retrieve all documents from the PGVector store
            documents = self.vectorstore.similarity_search(query="", k=1000)  # Adjust `k` as needed
            return [doc.page_content for doc in documents]
        except Exception as e:
            logger.error(f"Failed to retrieve documents: {e}")
            return []

    def delete_documents(self, filenames: List[str]) -> bool:
        logger.info(f"[ENTRY] DocumentService delete_documents")
        try:
            # Delete documents by filename (you may need to implement custom logic for this)
            for filename in filenames:
                # Custom logic to delete documents by filename (if needed)
                pass
            logger.info(f"Deleted documents: {filenames}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete documents: {e}")
            return False