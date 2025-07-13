from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.search_service import search_service
from services.sync_service import sync_service

router = APIRouter(prefix="/elasticsearch", tags=["elasticsearch"])

class SearchRequest(BaseModel):
    query: str
    regions: Optional[List[str]] = None
    procurement_method: Optional[str] = None
    procurement_category: Optional[List[str]] = None
    notice_type: Optional[List[str]] = None
    tender_status: Optional[List[str]] = None
    contracting_entity_name: Optional[List[str]] = None
    closing_date_after: Optional[str] = None
    closing_date_before: Optional[str] = None
    publication_date_after: Optional[str] = None
    publication_date_before: Optional[str] = None
    limit: Optional[int] = 20

class TenderResult(BaseModel):
    # Core identifiers
    id: str
    reference_number: Optional[str] = None
    solicitation_number: Optional[str] = None
    
    # Main content
    title: Optional[str] = None
    tender_description: Optional[str] = None
    precomputed_summary: Optional[str] = None
    
    # Dates
    publication_date: Optional[str] = None
    tender_closing_date: Optional[str] = None
    expected_contract_start_date: Optional[str] = None
    expected_contract_end_date: Optional[str] = None
    
    # Status and classification
    tender_status: Optional[str] = None
    notice_type: Optional[str] = None
    procurement_method: Optional[str] = None
    procurement_category: Optional[str] = None
    
    # Geographic information
    regions_of_delivery: Optional[str] = None
    regions_of_opportunity: Optional[str] = None
    contracting_entity_province: Optional[str] = None
    contracting_entity_city: Optional[str] = None
    contracting_entity_name: Optional[str] = None
    
    # Classification codes
    gsin: Optional[str] = None
    gsin_description: Optional[str] = None
    unspsc: Optional[str] = None
    unspsc_description: Optional[str] = None
    
    # Search metadata
    search_score: Optional[float] = None
    match_explanation: Optional[str] = None
    notice_url: Optional[str] = None

@router.post("/search", response_model=List[TenderResult])
def search_tenders_endpoint(request: SearchRequest):
    """Search tenders with natural language using AI embeddings"""
    try:
        results = search_service.search_tenders(
            query=request.query,
            regions=request.regions,
            procurement_method=request.procurement_method,
            closing_date_after=request.closing_date_after,
            limit=request.limit
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync")
def sync_all_tenders():
    """Sync all tenders from Supabase to Elasticsearch index"""
    try:
        result = sync_service.sync_all_tenders()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sync/{tender_id}")
def sync_single_tender(tender_id: str):
    """Sync a single tender by ID"""
    try:
        result = sync_service.sync_single_tender(tender_id)
        if result["status"] == "error":
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
def get_sync_status():
    """Get current synchronization status"""
    try:
        result = sync_service.get_sync_status()
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
def elasticsearch_health():
    """Check Elasticsearch cluster health"""
    try:
        health = search_service.health_check()
        if health["status"] == "unhealthy":
            raise HTTPException(status_code=503, detail=health)
        return health
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create-index")
def create_search_index():
    """Create the tenders search index (admin only)"""
    try:
        search_service.create_tenders_index()
        return {"message": "Tenders index created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))