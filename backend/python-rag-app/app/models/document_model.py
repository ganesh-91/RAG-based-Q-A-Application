from pydantic import BaseModel
from typing import Optional, List

class Document(BaseModel):
    text: str
    metadata: Optional[dict] = None

class Question(BaseModel):
    question: str
    document_ids: Optional[List[int]] = None