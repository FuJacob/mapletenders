from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any
import logging
import json
from datetime import datetime

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self):
        logger.info("🚀 Initializing SearchService")
        
        # Load embedding model
        logger.info("📊 Loading SentenceTransformer model: all-MiniLM-L6-v2")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("✅ SentenceTransformer model loaded successfully")
        
        # Connect to Elasticsearch
        logger.info("🔗 Connecting to Elasticsearch at http://localhost:9200")
        self.es = Elasticsearch(['http://localhost:9200'])
        logger.info("✅ Elasticsearch connection established")
        
    def create_tenders_index(self):
        """Create the search index matching actual database schema"""
        logger.info("🏗️ Creating tenders index with database schema mapping")
        mapping = {
            "mappings": {
                "properties": {
                    # Core identifiers
                    "id": {"type": "keyword"},
                    "source": {"type": "keyword"},
                    "source_reference": {"type": "keyword"},
                    "source_url": {"type": "keyword"},
                    
                    # Main content fields - matching database schema
                    "title": {"type": "text", "analyzer": "english"},
                    "description": {"type": "text", "analyzer": "english"},
                    "summary": {"type": "text"},
                    
                    # Dates - matching database schema
                    "published_date": {"type": "date"},
                    "closing_date": {"type": "date"},
                    "contract_start_date": {"type": "date"},
                    "last_scraped_at": {"type": "date"},
                    "created_at": {"type": "date"},
                    "updated_at": {"type": "date"},
                    
                    # Status and classification - matching database schema
                    "status": {"type": "keyword"},
                    "procurement_type": {"type": "keyword"},
                    "procurement_method": {"type": "keyword"},
                    "category_primary": {"type": "keyword"},
                    
                    # Geographic information - matching database schema
                    "delivery_location": {"type": "keyword"},
                    
                    # Financial information
                    "estimated_value_min": {"type": "float"},
                    "currency": {"type": "keyword"},
                    
                    # Organization details - matching database schema
                    "contracting_entity_name": {"type": "text"},
                    "contracting_entity_city": {"type": "keyword"},
                    "contracting_entity_province": {"type": "keyword"},
                    "contracting_entity_country": {"type": "keyword"},
                    
                    # Contact information - matching database schema
                    "contact_name": {"type": "text"},
                    "contact_email": {"type": "keyword"},
                    "contact_phone": {"type": "keyword"},
                    
                    # Classification codes - matching database schema
                    "gsin": {"type": "keyword"},
                    "unspsc": {"type": "keyword"},
                    
                    # Additional info - matching database schema
                    "plan_takers_count": {"type": "integer"},
                    "submissions_count": {"type": "integer"},
                    
                    # AI-generated embedding
                    "embedding": {
                        "type": "dense_vector",
                        "dims": 384
                    },
                    "embedding_input": {"type": "text"}
                }
            }
        }
        
        try:
            result = self.es.indices.create(index="tenders", body=mapping, ignore=400)
            logger.info(f"✅ Tenders index created successfully: {result}")
            logger.info("📋 Index mapping includes database schema fields: title, description, summary, closing_date, status, etc.")
        except Exception as e:
            logger.error(f"❌ Failed to create tenders index: {e}")
            raise

    def index_tender(self, tender_data: Dict[str, Any]):
        """Add one tender to search index using new schema"""
        tender_id = tender_data.get("id", "unknown")
        logger.info(f"📝 Indexing tender: {tender_id}")
        
        # Sanitize empty string date fields
        date_fields = [
            "published_date",
            "closing_date", 
            "contract_start_date",
            "last_scraped_at",
            "created_at",
            "updated_at"
        ]
        for field in date_fields:
            if tender_data.get(field) == "":
                tender_data[field] = None

        # Use precomputed embedding directly
        embedding = tender_data.get("embedding")
        if embedding:
            logger.debug(f"🔢 Using precomputed embedding for tender {tender_id} (length: {len(embedding) if isinstance(embedding, list) else 'unknown'})")
        else:
            logger.warning(f"⚠️ No embedding found for tender {tender_id}")
        
        # Log key fields being indexed
        logger.debug(f"📊 Tender data - Title: '{tender_data.get('title', 'N/A')[:50]}...', Status: '{tender_data.get('status')}', Closing: '{tender_data.get('closing_date')}')")
        
        # Build document with all available fields matching database schema
        doc = {
            # Core identifiers
            "id": tender_data.get("id"),
            "source": tender_data.get("source"),
            "source_reference": tender_data.get("source_reference"),
            "source_url": tender_data.get("source_url"),
            
            # Main content - matching database schema
            "title": tender_data.get("title", ""),
            "description": tender_data.get("description", ""),
            "summary": tender_data.get("summary"),
            
            # Dates - matching database schema
            "published_date": tender_data.get("published_date"),
            "closing_date": tender_data.get("closing_date"),
            "contract_start_date": tender_data.get("contract_start_date"),
            "last_scraped_at": tender_data.get("last_scraped_at"),
            "created_at": tender_data.get("created_at"),
            "updated_at": tender_data.get("updated_at"),
            
            # Status and classification - matching database schema
            "status": tender_data.get("status"),
            "procurement_type": tender_data.get("procurement_type"),
            "procurement_method": tender_data.get("procurement_method"),
            "category_primary": tender_data.get("category_primary"),
            
            # Geographic information - matching database schema
            "delivery_location": tender_data.get("delivery_location"),
            
            # Financial information
            "estimated_value_min": tender_data.get("estimated_value_min"),
            "currency": tender_data.get("currency"),
            
            # Organization details - matching database schema
            "contracting_entity_name": tender_data.get("contracting_entity_name"),
            "contracting_entity_city": tender_data.get("contracting_entity_city"),
            "contracting_entity_province": tender_data.get("contracting_entity_province"),
            "contracting_entity_country": tender_data.get("contracting_entity_country"),
            
            # Contact information - matching database schema
            "contact_name": tender_data.get("contact_name"),
            "contact_email": tender_data.get("contact_email"),
            "contact_phone": tender_data.get("contact_phone"),
            
            # Classification codes - matching database schema
            "gsin": tender_data.get("gsin"),
            "unspsc": tender_data.get("unspsc"),
            
            # Additional info - matching database schema
            "plan_takers_count": tender_data.get("plan_takers_count"),
            "submissions_count": tender_data.get("submissions_count"),
            
            # Embedding
            "embedding": embedding,
            "embedding_input": tender_data.get("embedding_input")
        }
        
        try:
            result = self.es.index(index="tenders", id=tender_data["id"], body=doc)
            logger.info(f"✅ Successfully indexed tender {tender_id}")
            logger.debug(f"🔍 Elasticsearch response: {result}")
        except Exception as e:
            logger.error(f"❌ Failed to index tender {tender_id}: {e}")
            logger.error(f"📄 Tender data that failed: {json.dumps({k: v for k, v in tender_data.items() if k not in ['embedding']}, default=str, indent=2)}")
            raise

    def _generate_embedding(self, tender_data: Dict[str, Any]) -> List[float]:
        """Generate embedding from tender content using flat database schema"""
        # Combine multiple fields for rich embedding
        content_parts = []
        
        if tender_data.get('title'):
            content_parts.append(tender_data['title'])
        if tender_data.get('description'):
            content_parts.append(tender_data['description'])
        if tender_data.get('summary'):
            content_parts.append(tender_data['summary'])
            
        text_content = " ".join(content_parts)
        return self.model.encode(text_content).tolist()

    def search_tenders(self, query: str, regions: Optional[List[str]] = None, 
                      procurement_method: Optional[str] = None,
                      procurement_category: Optional[List[str]] = None,
                      notice_type: Optional[List[str]] = None,
                      status: Optional[List[str]] = None,
                      contracting_entity_name: Optional[List[str]] = None,
                      closing_date_after: Optional[str] = None,
                      closing_date_before: Optional[str] = None,
                      publication_date_after: Optional[str] = None,
                      publication_date_before: Optional[str] = None,
                      limit: int = 20) -> List[Dict[str, Any]]:
        """Search tenders with natural language and advanced filters"""
        search_start_time = datetime.now()
        logger.info(f"🔍 SEARCH REQUEST RECEIVED")
        logger.info(f"📝 Query: '{query}'")
        logger.info(f"📊 Filters: regions={regions}, proc_method={procurement_method}, proc_category={procurement_category}")
        logger.info(f"📊 More filters: notice_type={notice_type}, status={status}, entity={contracting_entity_name}")
        logger.info(f"📅 Date filters: closing_after={closing_date_after}, closing_before={closing_date_before}")
        logger.info(f"📅 Pub date filters: pub_after={publication_date_after}, pub_before={publication_date_before}")
        logger.info(f"🔢 Limit: {limit}")
        
        # Check if index exists
        try:
            if not self.es.indices.exists(index="tenders"):
                logger.warning("⚠️ Tenders index does not exist, creating it...")
                self.create_tenders_index()
                logger.info("📋 Index created but no data synced yet - returning empty results")
                return []  # Return empty results until data is synced
            else:
                logger.info("✅ Tenders index exists")
        except Exception as e:
            logger.error(f"❌ Error checking index existence: {e}")
            return []
        
        # Generate embedding for the search query
        try:
            logger.info("🧠 Generating AI embedding for search query...")
            embedding_start = datetime.now()
            query_embedding = self.model.encode(query).tolist()
            embedding_time = (datetime.now() - embedding_start).total_seconds() * 1000
            logger.info(f"✅ Generated embedding: {len(query_embedding)} dimensions in {embedding_time:.1f}ms")
        except Exception as e:
            logger.error(f"❌ Error generating embedding: {e}")
            return []
        # Build search query with enhanced field targeting - only return minimal fields
        logger.info("🏗️ Building Elasticsearch query...")
        search_body = {
            "size": limit,
            "_source": ["id", "title", "description"],  # Minimal fields for match explanation
            "query": {
                "bool": {
                    "should": [
                        # Vector similarity search (primary)
                        {
                            "script_score": {
                                "query": {"match_all": {}},
                                "script": {
                                    "source": "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
                                    "params": {"query_vector": query_embedding}
                                },
                                "boost": 0.6
                            }
                        },
                        # Multi-field text search using database schema
                        {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "title^3",
                                    "description^2", 
                                    "summary^2"
                                ],
                                "type": "best_fields",
                                "boost": 0.4
                            }
                        }
                    ]
                }
            },
            "sort": [
                {"_score": {"order": "desc"}},
                {"closing_date": {"order": "asc", "missing": "_last"}}
            ]
        }
        
        # Add filters
        logger.info("🔧 Building search filters...")
        filters = []
        applied_filters = []
        
        # Regional filtering using database schema
        if regions:
            filters.append({"terms": {"delivery_location": regions}})
            applied_filters.append(f"regions: {regions}")
        
        # Procurement method filtering
        if procurement_method:
            filters.append({"term": {"procurement_method": procurement_method}})
            applied_filters.append(f"procurement_method: {procurement_method}")
        
        # Procurement category filtering using database schema
        if procurement_category:
            filters.append({"terms": {"category_primary": procurement_category}})
            applied_filters.append(f"category_primary: {procurement_category}")
        
        # Notice type filtering using database schema
        if notice_type:
            filters.append({"terms": {"procurement_type": notice_type}})
            applied_filters.append(f"procurement_type: {notice_type}")
        
        # Tender status filtering using database schema
        if status:
            filters.append({"terms": {"status": status}})
            applied_filters.append(f"status: {status}")
        else:
            # Only show open tenders by default if no status specified
            filters.append({
                "bool": {
                    "should": [
                        {"term": {"status": "Open"}},
                        {"bool": {"must_not": {"exists": {"field": "status"}}}}
                    ]
                }
            })
            applied_filters.append("status: Open (default)")
        
        # Contracting entity filtering using actual schema
        if contracting_entity_name:
            filters.append({"terms": {"contracting_entity_name": contracting_entity_name}})
            applied_filters.append(f"contracting_entity_name: {contracting_entity_name}")
        
        # Closing date filtering using database schema
        if closing_date_after or closing_date_before:
            date_range = {}
            if closing_date_after:
                date_range["gte"] = closing_date_after
            if closing_date_before:
                date_range["lte"] = closing_date_before
            filters.append({
                "range": {
                    "closing_date": date_range
                }
            })
            applied_filters.append(f"closing_date: {date_range}")
        
        # Publication date filtering
        if publication_date_after or publication_date_before:
            date_range = {}
            if publication_date_after:
                date_range["gte"] = publication_date_after
            if publication_date_before:
                date_range["lte"] = publication_date_before
            filters.append({
                "range": {
                    "publication_date": date_range
                }
            })
            applied_filters.append(f"publication_date: {date_range}")
        
        if filters:
            search_body["query"]["bool"]["filter"] = filters
            logger.info(f"🔧 Applied {len(filters)} filters: {', '.join(applied_filters)}")
        else:
            logger.info("🔧 No filters applied")
        
        # Execute search
        try:
            logger.info("🚀 Executing Elasticsearch search...")
            logger.debug(f"📋 Search body: {json.dumps(search_body, indent=2)}")
            
            search_exec_start = datetime.now()
            response = self.es.search(index="tenders", body=search_body)
            search_exec_time = (datetime.now() - search_exec_start).total_seconds() * 1000
            
            total_hits = response.get('hits', {}).get('total', {})
            if isinstance(total_hits, dict):
                hit_count = total_hits.get('value', 0)
                hit_relation = total_hits.get('relation', 'eq')
                logger.info(f"✅ Search completed: {hit_count} hits ({hit_relation}) in {search_exec_time:.1f}ms")
            else:
                hit_count = total_hits
                logger.info(f"✅ Search completed: {hit_count} hits in {search_exec_time:.1f}ms")
                
        except Exception as e:
            logger.error(f"❌ Elasticsearch search error: {e}")
            logger.error(f"📋 Failed search body: {json.dumps(search_body, indent=2)}")
            # Return empty results instead of crashing
            return []
        
        # Format results with minimal data - only ID and search metadata
        logger.info("🔄 Processing search results...")
        results = []
        for i, hit in enumerate(response['hits']['hits']):
            try:
                result = {
                    'id': hit['_source']['id'],
                    'search_score': hit['_score'],
                    'match_explanation': self._get_match_explanation(hit, query)
                }
                results.append(result)
                logger.debug(f"📊 Result {i+1}: ID={result['id']}, Score={result['search_score']:.3f}, Reason={result['match_explanation']}")
            except Exception as e:
                logger.error(f"❌ Error processing search hit {i+1}: {e}")
                logger.error(f"📄 Hit data: {hit}")
                continue
        
        total_search_time = (datetime.now() - search_start_time).total_seconds() * 1000
        logger.info(f"🎉 SEARCH COMPLETED: {len(results)} results returned in {total_search_time:.1f}ms total")
        
        if results:
            logger.info(f"🏆 Top result: {results[0]['id']} (score: {results[0]['search_score']:.3f})")
        else:
            logger.warning("⚠️ No results found for this search query")
            
        return results

    def _get_match_explanation(self, hit: Dict, query: str) -> str:
        """Generate a brief explanation of why this tender matched"""
        explanation_parts = []
        
        # Check title match
        title = hit['_source'].get('title') or ''
        if query.lower() in title.lower():
            explanation_parts.append("title match")
            
        # Check description match
        description = hit['_source'].get('description') or ''
        if query.lower() in description.lower():
            explanation_parts.append("description match")
            
        # Default to semantic similarity
        if not explanation_parts:
            explanation_parts.append("semantic similarity")
            
        return ", ".join(explanation_parts)

    def health_check(self) -> Dict[str, str]:
        """Check Elasticsearch health"""
        logger.info("🏥 Checking Elasticsearch health...")
        try:
            health = self.es.cluster.health()
            logger.info(f"✅ Elasticsearch health: {health['status']}")
            return {"elasticsearch": health["status"], "status": "healthy"}
        except Exception as e:
            logger.error(f"❌ Elasticsearch health check failed: {e}")
            return {"elasticsearch": "red", "status": "unhealthy", "error": str(e)}

# Global instance
search_service = SearchService()