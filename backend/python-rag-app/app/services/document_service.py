# services/document_service.py

import os
import logging
from typing import List, Dict, Any

from langchain.vectorstores import FAISS
from langchain.schema import Document

from langchain_unstructured import UnstructuredLoader
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from app.config.settings import settings
from app.services.vectorstore_service import get_vectorstore, create_vectorstore_langchain, del_docs_vectorstore_langchain, get_docs_vectorstore_langchain, initialize_vectorstore

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):

        try:
            self.vectorstore = create_vectorstore_langchain()
        except RuntimeError as e:
            print(f"Error loading vectorstore: {e}")
            # Initialize a new vectorstore
            self.vectorstore = initialize_vectorstore(settings)

    def load_document(self, file_path: str):
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
        logger.info(f"[ENTRY] DocumentService ingest_docs")
        if not filename.endswith((".docx", ".pdf", ".doc")):
            raise ValueError(f"{filename} is not a valid doc, docx or PDF")

        try:
            raw_documents = self.load_document(filepath)
            if raw_documents:
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                documents = text_splitter.split_documents(raw_documents)
                vs = get_vectorstore() 
                vs.add_documents(documents)
                vs.save_local(settings.VECTORSTORE_PATH)
            else:
                logger.warning("No documents available to process!")
        except Exception as e:
            logger.error(f"Failed to ingest document due to exception {e}")
            raise ValueError("Failed to upload document. Please upload an unstructured text document.")
        logger.info(f"[EXIT] DocumentService ingest_docs")
        return True

    def get_documents(self) -> List[str]:
        logger.info(f"[ENTRY] DocumentService get_documents")
        try:
            if self.vectorstore:
                return get_docs_vectorstore_langchain()
        except Exception as e:
            logger.error(f"Vectorstore not initialized. Error details: {e}")
        logger.info(f"[EXIT] DocumentService get_documents")
        return []

    def delete_documents(self, filenames: List[str]) -> bool:
        logger.info(f"[ENTRY] DocumentService delete_documents")
        try:
            if self.vectorstore:
                return del_docs_vectorstore_langchain(filenames)
        except Exception as e:
            logger.error(f"Vectorstore not initialized. Error details: {e}")
        logger.info(f"[EXIT] DocumentService delete_documents")
        return False