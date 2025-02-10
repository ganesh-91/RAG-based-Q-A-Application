import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_unstructured import UnstructuredLoader
from langchain_postgres import PGVector
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

class DocumentService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.connection_string = os.getenv("DATABASE_URL")
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

    def ingest_document(self, file_path: str):
        documents = self.load_document(file_path)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        texts = text_splitter.split_documents(documents)
        self.vector_store.add_documents(texts)
        return {"message": "File ingested successfully"}

if __name__ == "__main__":
    document_service = DocumentService()