# config/settings.py

class Settings:
    VECTORSTORE_PATH = "vectorstore.pkl"
    RETRIEVER_TOP_K = 5
    RETRIEVER_SCORE_THRESHOLD = 0.7

settings = Settings()