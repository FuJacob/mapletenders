import os
from supabase import create_client, Client
from .search_service import search_service
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

class SyncService:
    def __init__(self):
        # Supabase connection
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
            
        self.supabase: Client = create_client(supabase_url, supabase_key)

    def sync_all_tenders(self) -> Dict[str, Any]:
        """Sync all tenders from Supabase to Elasticsearch"""
        
        print("🚀 Starting tender sync...")
        
        try:
            # Create index
            search_service.create_tenders_index()
            
            # Get all tenders from Supabase
            response = self.supabase.table('tenders').select('*').execute()
            tenders = response.data
            
            print(f"📊 Found {len(tenders)} tenders")
            
            indexed_count = 0
            failed_count = 0
            
            # Index each tender
            for i, tender in enumerate(tenders):
                try:
                    search_service.index_tender(tender)
                    indexed_count += 1
                    
                    if (i + 1) % 10 == 0:
                        print(f"✅ Indexed {i+1}/{len(tenders)}")
                        
                except Exception as e:
                    failed_count += 1
                    print(f"❌ Error indexing tender {tender.get('id')}: {e}")
            
            print("🎉 Sync complete!")
            
            return {
                "status": "success",
                "total_tenders": len(tenders),
                "indexed": indexed_count,
                "failed": failed_count
            }
            
        except Exception as e:
            print(f"💥 Sync failed: {e}")
            return {
                "status": "error",
                "error": str(e)
            }

    def sync_single_tender(self, tender_id: str) -> Dict[str, Any]:
        """Sync a single tender by ID"""
        
        try:
            # Get tender from Supabase
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
            # Get tender count from Supabase
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