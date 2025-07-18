from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.search_service import search_service
from services.sync_service import sync_service
import logging
from datetime import datetime

router = APIRouter(prefix="/elasticsearch", tags=["elasticsearch"])

# Configure logging
logger = logging.getLogger(__name__)

class SearchRequest(BaseModel):
    query: str
    regions: Optional[List[str]] = None
    procurement_method: Optional[str] = None
    procurement_category: Optional[List[str]] = None
    notice_type: Optional[List[str]] = None
    status: Optional[List[str]] = None
    contracting_entity_name: Optional[List[str]] = None
    closing_date_after: Optional[str] = None
    closing_date_before: Optional[str] = None
    publication_date_after: Optional[str] = None
    publication_date_before: Optional[str] = None
    limit: Optional[int] = 20

class SearchResult(BaseModel):
    # Only return minimal data from Elasticsearch
    id: str
    search_score: float
    match_explanation: str

@router.post("/search", response_model=List[SearchResult])
def search_tenders_endpoint(request: SearchRequest):
    """Search tenders with natural language using AI embeddings"""
    request_start_time = datetime.now()
    logger.info("🌐 API SEARCH REQUEST RECEIVED")
    logger.info(f"📝 Request: query='{request.query}', limit={request.limit}")
    logger.info(f"🔧 Filters: regions={request.regions}, method={request.procurement_method}")
    
    try:
        results = search_service.search_tenders(
            query=request.query,
            regions=request.regions,
            procurement_method=request.procurement_method,
            procurement_category=request.procurement_category,
            notice_type=request.notice_type,
            status=request.status,
            contracting_entity_name=request.contracting_entity_name,
            closing_date_after=request.closing_date_after,
            closing_date_before=request.closing_date_before,
            publication_date_after=request.publication_date_after,
            publication_date_before=request.publication_date_before,
            limit=request.limit
        )
        
        request_time = (datetime.now() - request_start_time).total_seconds() * 1000
        logger.info(f"✅ API SEARCH COMPLETED: {len(results)} results in {request_time:.1f}ms")
        return results
        
    except Exception as e:
        request_time = (datetime.now() - request_start_time).total_seconds() * 1000
        logger.error(f"❌ API SEARCH FAILED after {request_time:.1f}ms: {e}")
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