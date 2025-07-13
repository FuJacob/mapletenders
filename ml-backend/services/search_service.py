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
        """Create the search index matching actual tender schema"""
        mapping = {
            "mappings": {
                "properties": {
                    # Core identifiers
                    "id": {"type": "keyword"},
                    "reference_number": {"type": "keyword"},
                    "solicitation_number": {"type": "keyword"},
                    
                    # Main content fields
                    "title": {"type": "text", "analyzer": "english"},
                    "tender_description": {"type": "text", "analyzer": "english"},
                    "precomputed_summary": {"type": "text"},
                    
                    # Dates
                    "publication_date": {"type": "date"},
                    "tender_closing_date": {"type": "date"},
                    "expected_contract_start_date": {"type": "date"},
                    "expected_contract_end_date": {"type": "date"},
                    "amendment_date": {"type": "date"},
                    
                    # Status and classification
                    "tender_status": {"type": "keyword"},
                    "notice_type": {"type": "keyword"},
                    "procurement_method": {"type": "keyword"},
                    "procurement_category": {"type": "keyword"},
                    
                    # Geographic information
                    "regions_of_delivery": {"type": "keyword"},
                    "regions_of_opportunity": {"type": "keyword"},
                    "contracting_entity_province": {"type": "keyword"},
                    "contracting_entity_city": {"type": "keyword"},
                    "contracting_entity_country": {"type": "keyword"},
                    
                    # Organization details
                    "contracting_entity_name": {"type": "text"},
                    "end_user_entities_name": {"type": "text"},
                    
                    # Contact information
                    "contact_name": {"type": "text"},
                    "contact_email": {"type": "keyword"},
                    "contact_phone": {"type": "keyword"},
                    "contact_province": {"type": "keyword"},
                    "contact_city": {"type": "keyword"},
                    
                    # Classification codes
                    "gsin": {"type": "keyword"},
                    "gsin_description": {"type": "text"},
                    "unspsc": {"type": "keyword"},
                    "unspsc_description": {"type": "text"},
                    
                    # Additional details
                    "trade_agreements": {"type": "text"},
                    "selection_criteria": {"type": "text"},
                    "limited_tendering_reason": {"type": "text"},
                    "amendment_number": {"type": "keyword"},
                    "attachments": {"type": "text"},
                    "notice_url": {"type": "keyword"},
                    
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
        """Add one tender to search index"""
        # Sanitize empty string date fields
        date_fields = [
            "publication_date",
            "tender_closing_date",
            "expected_contract_start_date",
            "expected_contract_end_date",
            "amendment_date"
        ]
        for field in date_fields:
            if tender_data.get(field) == "":
                tender_data[field] = None

        # Use precomputed embedding directly
        embedding = tender_data["embedding"]
        
        # Build document with all available fields
        doc = {
            # Core identifiers
            "id": tender_data.get("id"),
            "reference_number": tender_data.get("reference_number"),
            "solicitation_number": tender_data.get("solicitation_number"),
            
            # Main content
            "title": tender_data.get("title", ""),
            "tender_description": tender_data.get("tender_description", ""),
            "precomputed_summary": tender_data.get("precomputed_summary"),
            
            # Dates
            "publication_date": tender_data.get("publication_date"),
            "tender_closing_date": tender_data.get("tender_closing_date"),
            "expected_contract_start_date": tender_data.get("expected_contract_start_date"),
            "expected_contract_end_date": tender_data.get("expected_contract_end_date"),
            "amendment_date": tender_data.get("amendment_date"),
            
            # Status and classification
            "tender_status": tender_data.get("tender_status"),
            "notice_type": tender_data.get("notice_type"),
            "procurement_method": tender_data.get("procurement_method"),
            "procurement_category": tender_data.get("procurement_category"),
            
            # Geographic information
            "regions_of_delivery": tender_data.get("regions_of_delivery"),
            "regions_of_opportunity": tender_data.get("regions_of_opportunity"),
            "contracting_entity_province": tender_data.get("contracting_entity_province"),
            "contracting_entity_city": tender_data.get("contracting_entity_city"),
            "contracting_entity_country": tender_data.get("contracting_entity_country"),
            
            # Organization details
            "contracting_entity_name": tender_data.get("contracting_entity_name"),
            "end_user_entities_name": tender_data.get("end_user_entities_name"),
            
            # Contact information
            "contact_name": tender_data.get("contact_name"),
            "contact_email": tender_data.get("contact_email"),
            "contact_phone": tender_data.get("contact_phone"),
            "contact_province": tender_data.get("contact_province"),
            "contact_city": tender_data.get("contact_city"),
            
            # Classification codes
            "gsin": tender_data.get("gsin"),
            "gsin_description": tender_data.get("gsin_description"),
            "unspsc": tender_data.get("unspsc"),
            "unspsc_description": tender_data.get("unspsc_description"),
            
            # Additional details
            "trade_agreements": tender_data.get("trade_agreements"),
            "selection_criteria": tender_data.get("selection_criteria"),
            "limited_tendering_reason": tender_data.get("limited_tendering_reason"),
            "amendment_number": tender_data.get("amendment_number"),
            "attachments": tender_data.get("attachments"),
            "notice_url": tender_data.get("notice_url"),
            
            # Embedding
            "embedding": embedding,
            "embedding_input": tender_data.get("embedding_input")
        }
        
        self.es.index(index="tenders", id=tender_data["id"], body=doc)

    def _generate_embedding(self, tender_data: Dict[str, Any]) -> List[float]:
        """Generate embedding from tender content"""
        # Combine multiple fields for rich embedding
        content_parts = []
        
        if tender_data.get('title'):
            content_parts.append(tender_data['title'])
        if tender_data.get('tender_description'):
            content_parts.append(tender_data['tender_description'])
        if tender_data.get('gsin_description'):
            content_parts.append(tender_data['gsin_description'])
        if tender_data.get('unspsc_description'):
            content_parts.append(tender_data['unspsc_description'])
        if tender_data.get('precomputed_summary'):
            content_parts.append(tender_data['precomputed_summary'])
            
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
                        # Multi-field text search
                        {
                            "multi_match": {
                                "query": query,
                                "fields": [
                                    "title^3",
                                    "tender_description^2", 
                                    "precomputed_summary^2",
                                    "gsin_description^1.5",
                                    "unspsc_description^1.5",
                                    "contracting_entity_name^1",
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
                {"tender_closing_date": {"order": "asc", "missing": "_last"}}
            ]
        }
        
        # Add filters
        filters = []
        
        # Regional filtering
        if regions:
            region_filters = []
            for region in regions:
                region_filters.extend([
                    {"term": {"regions_of_delivery": region}},
                    {"term": {"regions_of_opportunity": region}},
                    {"term": {"contracting_entity_province": region}}
                ])
            if region_filters:
                filters.append({"bool": {"should": region_filters}})
        
        # Procurement method filtering
        if procurement_method:
            filters.append({"term": {"procurement_method": procurement_method}})
        
        # Procurement category filtering
        if procurement_category:
            filters.append({"terms": {"procurement_category": procurement_category}})
        
        # Notice type filtering
        if notice_type:
            filters.append({"terms": {"notice_type": notice_type}})
        
        # Tender status filtering
        if tender_status:
            filters.append({"terms": {"tender_status": tender_status}})
        else:
            # Only show open tenders by default if no status specified
            filters.append({
                "bool": {
                    "should": [
                        {"term": {"tender_status": "Active"}},
                        {"term": {"tender_status": "Open"}},
                        {"bool": {"must_not": {"exists": {"field": "tender_status"}}}}
                    ]
                }
            })
        
        # Contracting entity filtering
        if contracting_entity_name:
            filters.append({"terms": {"contracting_entity_name": contracting_entity_name}})
        
        # Closing date filtering
        if closing_date_after or closing_date_before:
            date_range = {}
            if closing_date_after:
                date_range["gte"] = closing_date_after
            if closing_date_before:
                date_range["lte"] = closing_date_before
            filters.append({
                "range": {
                    "tender_closing_date": date_range
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
                    "publication_date": date_range
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
        if query.lower() in hit['_source'].get('tender_description', '').lower():
            explanation_parts.append("description match")
            
        # Check category codes
        if (hit['_source'].get('gsin_description') and 
            any(word in hit['_source']['gsin_description'].lower() 
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