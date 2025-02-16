from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
from app.config.settings import settings

class QAService:
    def __init__(self, vector_store):
        self.vector_store = vector_store
        self.model_name = "google/flan-t5-base"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
        self.pipe = pipeline(
            "text2text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_new_tokens=2000,
            do_sample=True,
            temperature=settings.RETRIEVER_SCORE_THRESHOLD,
        )
        self.llm = HuggingFacePipeline(pipeline=self.pipe)

    def ask_question(self, query: str):
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(),
            input_key="question",
        )
        result = qa_chain.run(query)
        return {"answer": result}