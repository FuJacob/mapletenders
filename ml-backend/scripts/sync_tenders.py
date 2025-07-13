#!/usr/bin/env python3
"""
Standalone script to sync tenders from Supabase to Elasticsearch
Usage: python scripts/sync_tenders.py
"""

import sys
import os

# Add parent directory to path so we can import our services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.sync_service import sync_service

def main():
    """Run the tender synchronization"""
    print("🚀 MapleTenders Elasticsearch Sync")
    print("=" * 50)
    
    try:
        result = sync_service.sync_all_tenders()
        
        if result["status"] == "success":
            print(f"\n✅ Sync completed successfully!")
            print(f"📊 Total tenders: {result['total_tenders']}")
            print(f"✅ Successfully indexed: {result['indexed']}")
            print(f"❌ Failed: {result['failed']}")
        else:
            print(f"\n💥 Sync failed: {result['error']}")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()