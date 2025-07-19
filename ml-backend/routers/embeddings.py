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

class EmbeddingQueryRequest(BaseModel):
    q: str

class EmbeddingQueryResponse(BaseModel):
    embedded_query: List[float]

model = SentenceTransformer("all-MiniLM-L6-v2")

router = APIRouter(prefix="/embeddings", tags=["embeddings"])

@router.post("/generate/query", response_model=EmbeddingQueryResponse)
def generate_embedded_search(request: EmbeddingQueryRequest):
    """
    Generate an embedding for a search query
    """
    q = request.q
    if not q:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    embedding = model.encode([q])
    return {"embedded_query": embedding.tolist()[0]}



@router.post("/generate/data", response_model=EmbeddingResponse)
async def generate_embedding(data: List[Dict[str, Any]]):
    """
    Generate embeddings for a list of tender objects
    """
    if not data:
        raise HTTPException(status_code=400, detail="No data provided")

    texts = []
    print(f"Generating embeddings for {len(data)} tenders...")
    for i, tender in enumerate(data):
        # Use the new centralized schema column names
        title = tender.get("title", "")
        description = tender.get("description", "")
        category = tender.get("category_primary", "")
        procurement_method = tender.get("procurement_method", "")
        selection_criteria = tender.get("selection_criteria", "")
        trade_agreements = tender.get("trade_agreements", "")
        delivery_location = tender.get("delivery_location", "")
        
        # Extract from both nested and flat structures for compatibility
        # Try nested structure first, then fall back to flat structure
        contracting_entity = tender.get("contracting_entity", {})
        contracting_entity_name = (
            contracting_entity.get("name", "") if contracting_entity 
            else tender.get("contracting_entity_name", "")
        )
        
        end_user_entity = tender.get("end_user_entity", {})
        end_user_name = (
            end_user_entity.get("name", "") if end_user_entity 
            else tender.get("end_user_entity_name", "")
        )
        
        classification_codes = tender.get("classification_codes", {})
        gsin_description = (
            classification_codes.get("gsin_description", "") if classification_codes 
            else tender.get("gsin", "")
        )
    
        combined_text = f"""
Title: {title}
Description: {description}
Category: {category}
Procurement Method: {procurement_method}
Selection Criteria: {selection_criteria}
Trade Agreements: {trade_agreements}
Delivery Location: {delivery_location}
Contracting Entity: {contracting_entity_name}
End User: {end_user_name}
Classification: {gsin_description}
"""
        texts.append(combined_text.strip())
        print(f"Processed tender {i+1}/{len(data)}: {title[:50]}{'...' if len(title) > 50 else ''}")
    
    try:
        print("Encoding texts with sentence transformer...")
        embeddings = model.encode(texts)
        print(f"Successfully generated {len(embeddings)} embeddings")
        return {"embeddings": embeddings.tolist(), "embedding_inputs": texts}
    except Exception as e:
        print(f"Error during embedding generation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")