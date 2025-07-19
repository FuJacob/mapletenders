import os
from supabase import create_client, Client
from .search_service import search_service
from dotenv import load_dotenv
from typing import List, Dict, Any
import logging
from datetime import datetime
import json
load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class SyncService:
    def __init__(self):
        logger.info("🔄 Initializing SyncService")
        
        # Supabase connection
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not supabase_url or not supabase_key:
            logger.error("❌ Missing environment variables: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
        
        logger.info(f"🔗 Connecting to Supabase: {supabase_url}")
        self.supabase: Client = create_client(supabase_url, supabase_key)
        logger.info("✅ Supabase connection established")

    def sync_all_tenders(self) -> Dict[str, Any]:
        """Sync all tenders from Supabase to Elasticsearch"""
        sync_start_time = datetime.now()
        logger.info("🚀 SYNC OPERATION STARTED - All tenders from Supabase to Elasticsearch")
        
        try:
            # Create index
            logger.info("🏗️ Creating/updating Elasticsearch index...")
            search_service.create_tenders_index()
            
            # Get all tenders from Supabase (using new schema)
            logger.info("📋 Fetching tenders from Supabase database...")
            fetch_start = datetime.now()
            response = self.supabase.table('tenders').select('*').execute()
            tenders = response.data
            fetch_time = (datetime.now() - fetch_start).total_seconds() * 1000
            
            logger.info(f"📊 Found {len(tenders)} tenders in database (fetched in {fetch_time:.1f}ms)")
            
            if not tenders:
                logger.warning("⚠️ No tenders found in database - nothing to sync")
                return {
                    "status": "success",
                    "total_tenders": 0,
                    "indexed": 0,
                    "failed": 0
                }
            
            indexed_count = 0
            failed_count = 0
            failed_tenders = []
            
            # Index each tender
            logger.info("🔄 Starting to index tenders...")
            for i, tender in enumerate(tenders):
                try:
                    tender["embedding"] = json.loads(tender["embedding"])
                    search_service.index_tender(tender)
                    indexed_count += 1
                    
                    if (i + 1) % 10 == 0:
                        logger.info(f"✅ Progress: {i+1}/{len(tenders)} indexed")
                        
                except Exception as e:
                    failed_count += 1
                    tender_id = tender.get('id', 'unknown')
                    failed_tenders.append(tender_id)
                    logger.error(f"❌ Error indexing tender {tender_id}: {e}")
                    
            sync_time = (datetime.now() - sync_start_time).total_seconds()
            logger.info(f"🎉 SYNC COMPLETED in {sync_time:.1f}s")
            logger.info(f"📊 Results: {indexed_count} successful, {failed_count} failed")
            
            if failed_tenders:
                logger.warning(f"⚠️ Failed tender IDs: {failed_tenders[:10]}{'...' if len(failed_tenders) > 10 else ''}")
            
            return {
                "status": "success",
                "total_tenders": len(tenders),
                "indexed": indexed_count,
                "failed": failed_count,
                "sync_time_seconds": sync_time
            }
            
        except Exception as e:
            sync_time = (datetime.now() - sync_start_time).total_seconds()
            logger.error(f"💥 SYNC FAILED after {sync_time:.1f}s: {e}")
            return {
                "status": "error",
                "error": str(e),
                "sync_time_seconds": sync_time
            }

    def sync_single_tender(self, tender_id: str) -> Dict[str, Any]:
        """Sync a single tender by ID"""
        
        try:
            # Get tender from Supabase (using new schema)
            response = self.supabase.table('tenders').select('*').eq('id', tender_id).execute()
            
            if not response.data:
                return {
                    "status": "error",
                    "error": f"Tender {tender_id} not found in database"
                }
            
            tender = response.data[0]
            
            # Index the tender
            search_service.index_tender(tender)
            
            return {
                "status": "success",
                "tender_id": tender_id,
                "message": "Tender indexed successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "tender_id": tender_id,
                "error": str(e)
            }

    def get_sync_status(self) -> Dict[str, Any]:
        """Get current sync status and statistics"""
        
        try:
            # Get tender count from Supabase (using new schema)
            supabase_response = self.supabase.table('tenders').select('id', count='exact').execute()
            supabase_count = supabase_response.count
            
            # Get tender count from Elasticsearch
            es_response = search_service.es.count(index="tenders")
            es_count = es_response['count']
            
            return {
                "status": "success",
                "supabase_tenders": supabase_count,
                "elasticsearch_tenders": es_count,
                "in_sync": supabase_count == es_count,
                "elasticsearch_health": search_service.health_check()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }

# Global instance
sync_service = SyncService()