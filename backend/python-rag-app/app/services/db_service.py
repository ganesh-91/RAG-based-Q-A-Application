import faiss
import pickle
from config import FAISS_INDEX_FILE

def save_faiss_index(index):
    faiss.write_index(index, FAISS_INDEX_FILE)

def load_faiss_index():
    try:
        index = faiss.read_index(FAISS_INDEX_FILE)
        return index
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        return None