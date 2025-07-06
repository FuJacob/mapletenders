import os
from fastapi import APIRouter, HTTPException
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
from supabase import create_client, Client
from pydantic import BaseModel

# Pydantic models
class EmbeddingRequest(BaseModel):
    tenders: List[Dict[str, Any]]

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    embedding_inputs: List[str]

model = SentenceTransformer("all-MiniLM-L6-v2")

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


@router.post("/generate", response_model=EmbeddingResponse)
async def generate_embedding(data: List[Dict[str, Any]]):
    """
    Generate embeddings for a list of tender objects
    """
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")

    texts = []
    print("Generating embeddings for tenders...", len(data))
    for tender in data:
        # Use the actual CSV column names from your Node.js server
        title = tender.get("title", "")
        description = tender.get("tender_description", "")
        category = tender.get("procurement_category", "")
        procurement_method = tender.get("procurement_method", "")
        selection_criteria = tender.get("selection_criteria", "")
        trade_agreements = tender.get("trade_agreements", "")
        regions_of_delivery = tender.get("regions_of_delivery", "")
        end_user_entities_name = tender.get("end_user_entities_name", "")
    
        combined_text = f"""
Title: {title}
Description: {description}
Category: {category}
Procurement Method: {procurement_method}
Selection Criteria: {selection_criteria}
Trade Agreements: {trade_agreements}
Region of Delivery: {regions_of_delivery}
End User: {end_user_entities_name}
"""
        texts.append(combined_text.strip())
        print(f"Processed tender: {title}")
    
    embeddings = model.encode(texts)

    return {"embeddings": embeddings.tolist(), "embedding_inputs": texts}