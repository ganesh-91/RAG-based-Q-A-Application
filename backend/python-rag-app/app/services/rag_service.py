from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from langchain.vectorstores import PGVector
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer, AutoModelForSeq2SeqLM
from app.utils.config import Config

class RagService:
    def __init__(self, vector_store):
        self.vector_store = vector_store  # Ensure vector_store is passed and stored

        # Initialize the LLM
        self.model_name = "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        
        self.pipe = pipeline(
            "text2text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=2000,
            temperature=0.7,
        )
        self.llm = HuggingFacePipeline(pipeline=self.pipe)

    def answer_question(self, query: str):
        # Initialize the RetrievalQA chain
        retriever = self.vector_store.as_retriever()
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            input_key="question",
        )

        # Run the QA chain with the query
        result = qa_chain.invoke(query)
        
        # Extract the answer from the result
        answer = result.get("result", "No answer found.")
        return {"answer": answer}