from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from typing import Optional, List, Dict, Any

load_dotenv()

class SearchService:
    def __init__(self):
        # Load embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Connect to Elasticsearch
        self.es = Elasticsearch(['http://localhost:9200'])
        
    def create_tenders_index(self):
        """Create the search index matching new centralized tender schema"""
        mapping = {
            "mappings": {
                "properties": {
                    # Core identifiers
                    "id": {"type": "keyword"},
                    "source": {"type": "keyword"},
                    "source_reference": {"type": "keyword"},
                    "source_url": {"type": "keyword"},
                    
                    # Main content fields
                    "title": {"type": "text", "analyzer": "english"},
                    "description": {"type": "text", "analyzer": "english"},
                    "summary": {"type": "text"},
                    
                    # Dates
                    "published_date": {"type": "date"},
                    "closing_date": {"type": "date"},
                    "contract_start_date": {"type": "date"},
                    "amendment_date": {"type": "date"},
                    "last_scraped_at": {"type": "date"},
                    
                    # Status and classification
                    "status": {"type": "keyword"},
                    "procurement_type": {"type": "keyword"},
                    "procurement_method": {"type": "keyword"},
                    "category_primary": {"type": "keyword"},
                    "jurisdiction": {"type": "keyword"},
                    
                    # Geographic information
                    "delivery_location": {"type": "keyword"},
                    "regions": {"type": "keyword"},
                    
                    # Financial information
                    "estimated_value_min": {"type": "float"},
                    "currency": {"type": "keyword"},
                    
                    # Organization details (JSON objects)
                    "contracting_entity": {"type": "object"},
                    "contracting_entity.name": {"type": "text"},
                    "contracting_entity.city": {"type": "keyword"},
                    "contracting_entity.province": {"type": "keyword"},
                    "contracting_entity.country": {"type": "keyword"},
                    
                    "end_user_entity": {"type": "object"},
                    "end_user_entity.name": {"type": "text"},
                    
                    "primary_contact": {"type": "object"},
                    "primary_contact.name": {"type": "text"},
                    "primary_contact.email": {"type": "keyword"},
                    "primary_contact.phone": {"type": "keyword"},
                    
                    # Classification codes (JSON object)
                    "classification_codes": {"type": "object"},
                    "classification_codes.gsin": {"type": "keyword"},
                    "classification_codes.gsin_description": {"type": "text"},
                    "classification_codes.unspsc": {"type": "keyword"},
                    "classification_codes.unspsc_description": {"type": "text"},
                    
                    # Requirements and criteria
                    "requirements": {"type": "object"},
                    "selection_criteria": {"type": "text"},
                    "submission_method": {"type": "keyword"},
                    
                    # Documents and additional info
                    "documents": {"type": "object"},
                    "plan_takers_count": {"type": "integer"},
                    "submissions_count": {"type": "integer"},
                    "trade_agreements": {"type": "keyword"},
                    
                    # AI-generated embedding
                    "embedding": {
                        "type": "dense_vector",
                        "dims": 384
                    },
                    "embedding_input": {"type": "text"}
                }
            }
        }
        
        self.es.indices.create(index="tenders", body=mapping, ignore=400)
        print("✅ Tenders index created with full schema")

    def index_tender(self, tender_data: Dict[str, Any]):
        """Add one tender to search index using new schema"""
        # Sanitize empty string date fields
        date_fields = [
            "published_date",
            "closing_date",
            "contract_start_date",
            "amendment_date",
            "last_scraped_at"
        ]
        for field in date_fields:
            if tender_data.get(field) == "":
                tender_data[field] = None

        # Use precomputed embedding directly
        embedding = tender_data.get("embedding")
        
        # Extract nested object data safely
        contracting_entity = tender_data.get("contracting_entity") or {}
        end_user_entity = tender_data.get("end_user_entity") or {}
        primary_contact = tender_data.get("primary_contact") or {}
        classification_codes = tender_data.get("classification_codes") or {}
        
        # Build document with all available fields from new schema
        doc = {
            # Core identifiers
            "id": tender_data.get("id"),
            "source": tender_data.get("source"),
            "source_reference": tender_data.get("source_reference"),
            "source_url": tender_data.get("source_url"),
            
            # Main content
            "title": tender_data.get("title", ""),
            "description": tender_data.get("description", ""),
            "summary": tender_data.get("summary"),
            
            # Dates
            "published_date": tender_data.get("published_date"),
            "closing_date": tender_data.get("closing_date"),
            "contract_start_date": tender_data.get("contract_start_date"),
            "amendment_date": tender_data.get("amendment_date"),
            "last_scraped_at": tender_data.get("last_scraped_at"),
            
            # Status and classification
            "status": tender_data.get("status"),
            "procurement_type": tender_data.get("procurement_type"),
            "procurement_method": tender_data.get("procurement_method"),
            "category_primary": tender_data.get("category_primary"),
            "jurisdiction": tender_data.get("jurisdiction"),
            
            # Geographic information
            "delivery_location": tender_data.get("delivery_location"),
            "regions": tender_data.get("regions"),
            
            # Financial information
            "estimated_value_min": tender_data.get("estimated_value_min"),
            "currency": tender_data.get("currency"),
            
            # Organization details
            "contracting_entity": contracting_entity,
            "end_user_entity": end_user_entity,
            "primary_contact": primary_contact,
            
            # Classification codes
            "classification_codes": classification_codes,
            
            # Requirements and criteria
            "requirements": tender_data.get("requirements"),
            "selection_criteria": tender_data.get("selection_criteria"),
            "submission_method": tender_data.get("submission_method"),
            
            # Documents and additional info
            "documents": tender_data.get("documents"),
            "plan_takers_count": tender_data.get("plan_takers_count"),
            "submissions_count": tender_data.get("submissions_count"),
            "trade_agreements": tender_data.get("trade_agreements"),
            
            # Embedding
            "embedding": embedding,
            "embedding_input": tender_data.get("embedding_input")
        }
        
        self.es.index(index="tenders", id=tender_data["id"], body=doc)

    def _generate_embedding(self, tender_data: Dict[str, Any]) -> List[float]:
        """Generate embedding from tender content using new schema"""
        # Combine multiple fields for rich embedding
        content_parts = []
        
        if tender_data.get('title'):
            content_parts.append(tender_data['title'])
        if tender_data.get('description'):
            content_parts.append(tender_data['description'])
        if tender_data.get('summary'):
            content_parts.append(tender_data['summary'])
            
        # Extract from nested classification codes
        classification_codes = tender_data.get('classification_codes') or {}
        if classification_codes.get('gsin_description'):
            content_parts.append(classification_codes['gsin_description'])
        if classification_codes.get('unspsc_description'):
            content_parts.append(classification_codes['unspsc_description'])
            
        text_content = " ".join(content_parts)
        return self.model.encode(text_content).tolist()

    def search_tenders(self, query: str, regions: Optional[List[str]] = None, 
                      procurement_method: Optional[str] = None,
                      procurement_category: Optional[List[str]] = None,
                      notice_type: Optional[List[str]] = None,
                      tender_status: Optional[List[str]] = None,
                      contracting_entity_name: Optional[List[str]] = None,
                      closing_date_after: Optional[str] = None,
                      closing_date_before: Optional[str] = None,
                      publication_date_after: Optional[str] = None,
                      publication_date_before: Optional[str] = None,
                      limit: int = 20) -> List[Dict[str, Any]]:
        """Search tenders with natural language and advanced filters"""
        
        # Generate embedding for the search query
        query_embedding = self.model.encode(query).tolist()
        
        # Build search query with enhanced field targeting
        search_body = {
            "size": limit,
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
                        # Multi-field text search using new schema
                        {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "title^3",
                                    "description^2", 
                                    "summary^2",
                                    "classification_codes.gsin_description^1.5",
                                    "classification_codes.unspsc_description^1.5",
                                    "contracting_entity.name^1",
                                    "selection_criteria^1"
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
        filters = []
        
        # Regional filtering using new schema
        if regions:
            region_filters = []
            for region in regions:
                region_filters.extend([
                    {"term": {"delivery_location": region}},
                    {"terms": {"regions": [region]}},
                    {"term": {"contracting_entity.province": region}}
                ])
            if region_filters:
                filters.append({"bool": {"should": region_filters}})
        
        # Procurement method filtering
        if procurement_method:
            filters.append({"term": {"procurement_method": procurement_method}})
        
        # Procurement category filtering using new schema
        if procurement_category:
            filters.append({"terms": {"category_primary": procurement_category}})
        
        # Notice type filtering (now procurement_type)
        if notice_type:
            filters.append({"terms": {"procurement_type": notice_type}})
        
        # Tender status filtering using new schema
        if tender_status:
            filters.append({"terms": {"status": tender_status}})
        else:
            # Only show open tenders by default if no status specified
            filters.append({
                "bool": {
                    "should": [
                        {"term": {"status": "active"}},
                        {"term": {"status": "open"}},
                        {"bool": {"must_not": {"exists": {"field": "status"}}}}
                    ]
                }
            })
        
        # Contracting entity filtering using new schema
        if contracting_entity_name:
            filters.append({"terms": {"contracting_entity.name": contracting_entity_name}})
        
        # Closing date filtering
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
        
        # Publication date filtering
        if publication_date_after or publication_date_before:
            date_range = {}
            if publication_date_after:
                date_range["gte"] = publication_date_after
            if publication_date_before:
                date_range["lte"] = publication_date_before
            filters.append({
                "range": {
                    "published_date": date_range
                }
            })
        
        if filters:
            search_body["query"]["bool"]["filter"] = filters
        
        # Execute search
        response = self.es.search(index="tenders", body=search_body)
        
        # Format results with enhanced data
        results = []
        for hit in response['hits']['hits']:
            result = hit['_source']
            result['search_score'] = hit['_score']
            result['match_explanation'] = self._get_match_explanation(hit, query)
            results.append(result)
        
        return results

    def _get_match_explanation(self, hit: Dict, query: str) -> str:
        """Generate a brief explanation of why this tender matched"""
        explanation_parts = []
        
        # Check title match
        if query.lower() in hit['_source'].get('title', '').lower():
            explanation_parts.append("title match")
            
        # Check description match
        if query.lower() in hit['_source'].get('description', '').lower():
            explanation_parts.append("description match")
            
        # Check category codes
        classification_codes = hit['_source'].get('classification_codes', {})
        if (classification_codes.get('gsin_description') and 
            any(word in classification_codes['gsin_description'].lower() 
                for word in query.lower().split())):
            explanation_parts.append("category match")
            
        # Default to semantic similarity
        if not explanation_parts:
            explanation_parts.append("semantic similarity")
            
        return ", ".join(explanation_parts)

    def health_check(self) -> Dict[str, str]:
        """Check Elasticsearch health"""
        try:
            health = self.es.cluster.health()
            return {"elasticsearch": health["status"], "status": "healthy"}
        except Exception as e:
            return {"elasticsearch": "red", "status": "unhealthy", "error": str(e)}

# Global instance
search_service = SearchService()