from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from langchain.vectorstores import PGVector
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer, AutoModelForCausalLM
from app.config.settings import settings
from typing import Optional, List
import torch

class QAService:
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.model_name = "EleutherAI/gpt-neo-1.3B"
        #  model_name = "EleutherAI/gpt-neo-1.3B"
        # "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
        self.pipe = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=2000,
            temperature=0.7,
        )
        self.llm = HuggingFacePipeline(pipeline=self.pipe)

    async def answer_question(self, query: str):
        # Define a custom prompt template

        # Initialize the RetrievalQA chain with the custom prompt
        retriever = self.vector_store.as_retriever()
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            input_key="question",
        )

        # Run the QA chain with the query
        result = qa_chain.invoke(query)
        return {"answer": result}