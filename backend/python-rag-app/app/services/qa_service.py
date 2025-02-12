from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline
from langchain.prompts import PromptTemplate

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
            temperature=0.7,
        )
        self.llm = HuggingFacePipeline(pipeline=self.pipe)
        

    def ask_question(self, query: str):
        # Define a custom prompt template
        prompt_template = """Use the following context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

        Context: {context}

        Question: {question}

        Answer:"""
        
        # Create a PromptTemplate object
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )

        # Initialize the RetrievalQA chain with the custom prompt
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(),
            input_key="question",
            chain_type_kwargs={"prompt": prompt}  # Pass the custom prompt here
        )

        # Run the QA chain with the query
        result = qa_chain.invoke(query)
        return {"answer": result}