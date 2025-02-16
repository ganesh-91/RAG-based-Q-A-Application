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
from app.services.vectorstore_service import get_vectorstore, create_vectorstore_langchain, del_docs_vectorstore_langchain, get_docs_vectorstore_langchain

logger = logging.getLogger(__name__)

class DocumentService:
    def __init__(self):
        # Initialize the vector store
        self.vectorstore = create_vectorstore_langchain()

    def load_document(self, file_path: str):
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".doc") or file_path.endswith(".docx"):
            loader = UnstructuredLoader(file_path)
        else:
            raise ValueError("Unsupported file format")
        return loader.load()

    def ingest_docs(self, filepath: str, filename: str) -> None:
        if not filename.endswith((".txt", ".pdf", ".md")):
            raise ValueError(f"{filename} is not a valid Text, PDF, or Markdown file")

        try:
            raw_documents = self.load_document(filepath)
            if raw_documents:
                text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                documents = text_splitter.split_documents(raw_documents)
                vs = get_vectorstore()  # No argument needed
                vs.add_documents(documents)
                vs.save_local(settings.VECTORSTORE_PATH)
            else:
                logger.warning("No documents available to process!")
        except Exception as e:
            logger.error(f"Failed to ingest document due to exception {e}")
            raise ValueError("Failed to upload document. Please upload an unstructured text document.")

    def get_documents(self) -> List[str]:
        try:
            if self.vectorstore:
                return get_docs_vectorstore_langchain()
        except Exception as e:
            logger.error(f"Vectorstore not initialized. Error details: {e}")
        return []

    # def select_documents(self, selected_documents: List[str]) -> None:
    #     """
    #     Select specific documents for search.

    #     Args:
    #         selected_documents (List[str]): List of document filenames to consider for search.
    #     """
    #     self.selected_documents = selected_documents

    def delete_documents(self, filenames: List[str]) -> bool:
        try:
            if self.vectorstore:
                return del_docs_vectorstore_langchain(filenames)
        except Exception as e:
            logger.error(f"Vectorstore not initialized. Error details: {e}")
        return False