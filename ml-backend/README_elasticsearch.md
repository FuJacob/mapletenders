# MapleTenders Elasticsearch Setup

This document explains how to set up and use the Elasticsearch functionality for AI-powered tender search.

## Architecture

```
ml-backend/
├── services/
│   ├── search_service.py    # Core search functionality with embeddings
│   └── sync_service.py      # Supabase to Elasticsearch sync
├── routers/
│   └── elasticsearch.py    # FastAPI endpoints
└── scripts/
    └── sync_tenders.py      # Standalone sync script
```

## Prerequisites

1. **Elasticsearch running locally:**
   ```bash
   # Using Docker
   docker run -d --name elasticsearch \
     -p 9200:9200 \
     -e "discovery.type=single-node" \
     -e "xpack.security.enabled=false" \
     elasticsearch:8.8.0
   ```

2. **Environment variables:**
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Python dependencies:**
   ```bash
   pip install elasticsearch sentence-transformers supabase python-dotenv
   ```

## API Endpoints

### Search Tenders
```http
POST /elasticsearch/search
Content-Type: application/json

{
  "query": "IT infrastructure modernization",
  "regions": ["Ontario", "Quebec"],
  "procurement_method": "Request for Proposal",
  "closing_date_after": "2025-01-01",
  "limit": 10
}
```

### Sync Operations
```http
# Sync all tenders
POST /elasticsearch/sync

# Sync single tender
POST /elasticsearch/sync/{tender_id}

# Check sync status
GET /elasticsearch/status
```

### Health Checks
```http
# Elasticsearch health
GET /elasticsearch/health

# Create index (admin)
POST /elasticsearch/create-index
```

## Usage

### 1. Initial Setup
```bash
# Start Elasticsearch
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.8.0

# Run initial sync
python scripts/sync_tenders.py
```

### 2. Search Example
```python
import requests

response = requests.post("http://localhost:8000/elasticsearch/search", json={
    "query": "software development services",
    "budget_max": 50000,
    "limit": 5
})

results = response.json()
for tender in results:
    print(f"{tender['title']} - Score: {tender['score']}")
```

### 3. Monitoring
```bash
# Check sync status
curl http://localhost:8000/elasticsearch/status

# Check Elasticsearch health
curl http://localhost:8000/elasticsearch/health
```

## How It Works

1. **Embedding Generation**: Uses `all-MiniLM-L6-v2` model to create 384-dimensional vectors for tender titles and descriptions

2. **Hybrid Search**: Combines:
   - **Vector similarity** (70% weight): Semantic matching using cosine similarity
   - **Text search** (30% weight): Traditional keyword matching

3. **Filtering**: Supports budget range and location filters

4. **Real-time Sync**: Can sync individual tenders or bulk sync from Supabase

## Performance

- **Index size**: ~1KB per tender
- **Search latency**: <100ms for most queries
- **Embedding generation**: ~50ms per tender
- **Bulk sync**: ~100 tenders/second

## Troubleshooting

### Elasticsearch not responding
```bash
# Check if running
curl http://localhost:9200/_cluster/health

# Restart container
docker restart elasticsearch
```

### Sync failures
```bash
# Check logs
python scripts/sync_tenders.py

# Manual index creation
curl -X POST http://localhost:8000/elasticsearch/create-index
```

### Poor search results
- Verify embeddings are generated correctly
- Check if index mapping is correct
- Adjust boost weights in search query