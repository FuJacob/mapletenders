class TextSummaryRequest(BaseModel):
    text: str

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Tuple
import spacy
from spacy_layout import spaCyLayout
import io

# Initialize spaCy and layout models
try:
    nlp = spacy.load("en_core_web_lg")
    layout = spaCyLayout(nlp)
except OSError:
    # Fallback if model not installed
    nlp = None
    layout = None

router = APIRouter(prefix="/rfp", tags=["rfp"])

class RfpAnalysisResponse(BaseModel):
    sentences_with_dates: List[str]
    sentences_with_money: List[str]
    entities: List[Tuple[str, str]]

@router.post("/analyze_pdf", response_model=RfpAnalysisResponse)
async def analyze_pdf(file: UploadFile = File(...)):
    """
    Analyze a PDF document to extract dates, money amounts, and entities
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    if nlp is None or layout is None:
        raise HTTPException(
            status_code=500, 
            detail="NLP models not available. Please ensure en_core_web_lg is installed."
        )
    
    try:
        # Read the uploaded file
        pdf_data = await file.read()
        
        # Process with spaCy layout
        doc = layout(pdf_data)
        analyzed_doc = nlp(doc.text)
        
        # Extract sentences with dates
        sentences_with_dates = [
            sent.text for sent in analyzed_doc.sents 
            if any(ent.label_ == "DATE" for ent in sent.ents)
        ]
        
        # Extract sentences with money amounts
        sentences_with_money = [
            sent.text for sent in analyzed_doc.sents 
            if any(ent.label_ == "MONEY" for ent in sent.ents)
        ]
        
        # Extract all entities
        entities = [(ent.text, ent.label_) for ent in analyzed_doc.ents]
        
        return RfpAnalysisResponse(
            sentences_with_dates=sentences_with_dates,
            sentences_with_money=sentences_with_money,
            entities=entities
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint for RFP analysis service
    """
    return {
        "status": "healthy",
        "nlp_model_loaded": nlp is not None,
        "layout_model_loaded": layout is not None
    } 


# Summarize input text using sentence scoring based on word frequency.
# Returns top 2 most relevant sentences as the summary.
@router.post("/summarize_text")
async def summarize_text(request: TextSummaryRequest):
    """
    Summarize input text using sentence scoring based on word frequency.
    Returns top 2 most relevant sentences as the summary.
    """
    if nlp is None:
        raise HTTPException(status_code=500, detail="NLP model not available")

    doc = nlp(request.text)

    # Calculate word frequencies (excluding stop words and punctuation)
    word_freq = {}
    for token in doc:
        if token.is_stop or token.is_punct:
            continue
        word = token.text.lower()
        word_freq[word] = word_freq.get(word, 0) + 1

    # Score sentences
    sentence_scores = {}
    for sent in doc.sents:
        for token in sent:
            word = token.text.lower()
            if word in word_freq:
                sentence_scores[sent] = sentence_scores.get(sent, 0) + word_freq[word]

    # Sort sentences by score and select top 2
    top_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:2]
    summary = " ".join([sent.text for sent in top_sentences])

    return {"summary": summary}