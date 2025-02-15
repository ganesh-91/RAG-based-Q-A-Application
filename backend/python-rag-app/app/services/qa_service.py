from langchain.chains import RetrievalQA
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from app.utils.database import SessionLocal, Document
from langchain_community.llms import OpenAI
import os

from dotenv import load_dotenv

load_dotenv()

class QAService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))

    def answer_question(self, question: str, document_ids: list[int]):
        # Load documents from database
        db = SessionLocal()
        documents = db.query(Document).filter(Document.id.in_(document_ids)).all()
        db.close()

        # Generate embeddings and create a FAISS vector store
        texts = [doc.file_path for doc in documents]  # Use file_path as text for simplicity
        metadatas = [{"id": doc.id} for doc in documents]
        vector_store = FAISS.from_texts(texts, self.embeddings, metadatas=metadatas)

        # Perform Q&A
        qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(openai_api_key=os.getenv("OPENAI_API_KEY")),
            chain_type="stuff",
            retriever=vector_store.as_retriever(),
        )
        return qa_chain.run(question)