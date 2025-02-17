# models/schemas.py

from pydantic import BaseModel
from typing import List, Dict, Any

class Message(BaseModel):
    role: str
    content: str

class DocumentIngestRequest(BaseModel):
    filepath: str
    filename: str

class GenerateRequest(BaseModel):
    query: str
    chat_history: List[Message]
    use_knowledge_base: bool = True

class SearchRequest(BaseModel):
    content: str

class DocumentResponse(BaseModel):
    source: str
    content: str