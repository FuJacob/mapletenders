from fastapi import APIRouter, Request
from pydantic import BaseModel
import re
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

model = SentenceTransformer("all-MiniLM-L6-v2")
nlp = spacy.load("en_core_web_sm")

router = APIRouter(prefix="/format", tags=["format"])

class TextInput(BaseModel):
    text: str

def format_text(text: str):
    """
    Process the input text by cleaning and grouping similar lines into paragraphs.
    Returns a list of paragraph strings.
    """
    clean_text = re.sub(r"&[a-z]+;", "", text)
    doc = nlp(clean_text)
    lines = [sent.text.strip() for sent in doc.sents if sent.text.strip()]
    if not lines:
        return []

    embeddings = model.encode(lines)
    sim_matrix = cosine_similarity(embeddings)
    threshold = 0.75
    groups = []
    current_group = [0]

    for i in range(1, len(lines)):
        if sim_matrix[i][i - 1] > threshold:
            current_group.append(i)
        else:
            groups.append(current_group)
            current_group = [i]
    groups.append(current_group)

    paragraphs = [" ".join([lines[i] for i in group]) for group in groups]
    return paragraphs

@router.post("/")
def format_endpoint(data: TextInput):
    return format_text(data.text)