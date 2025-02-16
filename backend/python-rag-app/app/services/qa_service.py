import json
from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
from app.config.settings import settings
from app.services.vectorstore_service import get_vectorstore
from langchain.prompts import PromptTemplate

class QAService:
    def __init__(self):
        self.vector_store = get_vectorstore()
        self.model_name = "google/flan-t5-xl"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        self.pipe = pipeline(
            "text2text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.95,
            repetition_penalty=1.1,
            do_sample=True
        )
        self.llm = HuggingFacePipeline(pipeline=self.pipe)

    def ask_question(self, query: str):
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(),
            input_key="question",
        )
        result = qa_chain.invoke(query)
        return {"answer":  result}