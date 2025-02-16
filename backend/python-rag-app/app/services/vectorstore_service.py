# services/vectorstore_service.py

import os
import logging
from typing import List, Dict, Any

from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

from app.config.settings import settings

logger = logging.getLogger(__name__)

# Initialize the embedding model
embedding_model = HuggingFaceEmbeddings('sentence-transformers/all-mpnet-base-v2')

# Global vector store instance
vectorstore = None

def create_vectorstore_langchain() -> FAISS:
    """
    Create a new FAISS vector store or load an existing one.
    """
    global vectorstore
    try:
        if os.path.exists(settings.VECTORSTORE_PATH):
            logger.info("Loading existing vector store from disk.")
            vectorstore = FAISS.load_local(settings.VECTORSTORE_PATH, embedding_model,allow_dangerous_deserialization=True)
        else:
            logger.info("Creating a new vector store.")
            vectorstore = FAISS.from_texts(["Initial document"], embedding_model)
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to create or load vector store: {e}")
        raise

def get_vectorstore() -> FAISS:
    """
    Return the initialized vector store.
    """
    global vectorstore
    if vectorstore is None:
        raise ValueError("Vector store is not initialized. Call create_vectorstore_langchain() first.")
    return vectorstore

def add_documents_to_vectorstore(documents: List[Document]) -> None:
    """
    Add documents to the vector store.
    """
    global vectorstore
    try:
        vectorstore.add_documents(documents)
        vectorstore.save_local(settings.VECTORSTORE_PATH)
        logger.info("Documents added to vector store successfully.")
    except Exception as e:
        logger.error(f"Failed to add documents to vector store: {e}")
        raise

def get_docs_vectorstore_langchain() -> List[str]:
    """
    Retrieve the list of document filenames stored in the vector store.
    """
    global vectorstore
    try:
        docs = vectorstore.docstore._dict
        filenames = [os.path.basename(doc.metadata.get("source", "")) for doc in docs.values()]
        return list(set(filenames))  # Remove duplicates
    except Exception as e:
        logger.error(f"Failed to retrieve documents from vector store: {e}")
        return []

def del_docs_vectorstore_langchain(filenames: List[str]) -> bool:
    """
    Delete documents from the vector store based on filenames.
    """
    global vectorstore
    try:
        docs_to_delete = [
            doc for doc in vectorstore.docstore._dict.values()
            if os.path.basename(doc.metadata.get("source", "")) in filenames
        ]

        if docs_to_delete:
            vectorstore.delete([doc.metadata.get("id") for doc in docs_to_delete])
            vectorstore.save_local(settings.VECTORSTORE_PATH)
            logger.info(f"Deleted documents: {filenames}")
            return True
        else:
            logger.warning(f"No documents found to delete: {filenames}")
            return False
    except Exception as e:
        logger.error(f"Failed to delete documents from vector store: {e}")
        return False