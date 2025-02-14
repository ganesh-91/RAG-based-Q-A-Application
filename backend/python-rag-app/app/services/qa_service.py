# from langchain.chains import RetrievalQA
# from langchain_community.llms import HuggingFacePipeline
# from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
# from langchain.prompts import PromptTemplate
# import json

# class QAService:
#     def __init__(self, vector_store):
#         self.vector_store = vector_store
#         self.model_name = "google/flan-t5-xl"
#         self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
#         self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
#         self.pipe = pipeline(
#             "text-generation",
#             model=self.model,
#             tokenizer=self.tokenizer,
#             max_new_tokens=2000,
#             do_sample=True,
#             temperature=0.2,
#         )
#         self.llm = HuggingFacePipeline(pipeline=self.pipe)
        

#     def ask_question(self, query: str):
#         # Define a custom prompt template
#         prompt_template = """
#         You are an intelligent assistant helping with answering questions based on the provided context. Please ensure your responses are clear, concise, and conversational. Use a professional tone and provide as much relevant information as possible.
        
#         Context: {context}
        
#         Given the context above, please answer the following question in a friendly and informative way:
        
#         Question: {question}
        
#         Answer:
#         """
        
#         # Create a PromptTemplate object
#         prompt = PromptTemplate(
#             template=prompt_template,
#             input_variables=["context", "question"]
#         )

#         # Initialize the RetrievalQA chain with the custom prompt
#         qa_chain = RetrievalQA.from_chain_type(
#             llm=self.llm,
#             chain_type="stuff",
#             retriever=self.vector_store.as_retriever(),
#             input_key="question",
#             chain_type_kwargs={"prompt": prompt}  # Pass the custom prompt here
#         )

#         # Run the QA chain with the query
#         result = qa_chain.invoke(query)
#         formatted_json = json.dumps(result, indent=4)
#         print(formatted_json)
#         return {"answer": formatted_json}

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
        print('os.getenv("OPENAI_API_KEY")',os.getenv("OPENAI_API_KEY"))
        qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(openai_api_key=os.getenv("OPENAI_API_KEY")),
            chain_type="stuff",
            retriever=vector_store.as_retriever(),
        )
        return qa_chain.run(question)