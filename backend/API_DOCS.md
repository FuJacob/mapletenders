# Procuroo API Documentation

## Overview

Procuroo provides a comprehensive API for government tender management, including scraping, AI-powered search, user management, and subscription services. The system consists of two backends:

- **Main Backend** (Express.js) - Core API functionality on port 4000
- **ML Backend** (FastAPI) - AI/ML operations on port 8000

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Tender Management](#tender-management) 
3. [Search & AI Features](#search--ai-features)
4. [Data Scraping](#data-scraping)
5. [Subscription Management](#subscription-management)
6. [Bookmarks & Profiles](#bookmarks--profiles)
7. [Chat System](#chat-system)
8. [ML Backend Services](#ml-backend-services)

---

## Authentication & User Management

**Base URL:** `http://localhost:4000/auth`

### Sign Up
```http
POST /auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

### Sign In
```http
POST /auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com", 
  "password": "securepassword"
}
```

### Sign Out
```http
POST /auth/signout
```

### Get Current User
```http
GET /auth/user
```

**Headers:**
```
Authorization: Bearer {access_token}
```

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### Update Password
```http
POST /auth/update-password
```

**Request Body:**
```json
{
  "password": "newpassword",
  "access_token": "reset_token"
}
```

---

## Tender Management

**Base URL:** `http://localhost:4000/tenders`

### Get Tender by ID
```http
GET /tenders/getTenderById/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Software Development Services",
  "description": "...",
  "status": "open",
  "closing_date": "2024-03-15T23:59:59Z",
  "contracting_entity_name": "Government of Canada",
  "source": "canadian",
  "category_primary": "Information Technology"
}
```

### Get Tender Notice Details
```http
GET /tender-notice/:id
```

**Description:** Get detailed tender notice information for display.

### Search Tenders (AI-Powered)
```http
POST /tenders/searchTenders
```

**Request Body:**
```json
{
  "query": "software development",
  "filters": {
    "source": ["canadian", "toronto"],
    "status": ["open"],
    "categories": ["IT"]
  },
  "limit": 50,
  "offset": 0
}
```

**Response:**
```json
{
  "tenders": [...],
  "total": 150,
  "hasMore": true
}
```

### Get Open Tender Notices
```http
GET /tenders/getOpenTenderNoticesToDB
```

**Description:** Import tender notices from CSV to database.

### Download CSV Export
```http
GET /tenders/getOpenTenderNotices
```

**Description:** Download all open tenders as CSV file.

### Refresh Tender Data
```http
POST /tenders/refreshTenders
```

**Description:** Rate-limited endpoint to refresh tender data (24-hour cooldown).

### Elasticsearch Sync
```http
POST /tenders/syncToElasticsearch
```

**Description:** Sync all tenders to Elasticsearch for search.

```http
POST /tenders/syncTender/:tenderId
```

**Description:** Sync single tender to Elasticsearch.

---

## Search & AI Features

**Base URL:** `http://localhost:4000/ai`

### Generate AI Summary
```http
POST /ai/generateTenderSummary
```

**Request Body:**
```json
{
  "tenderId": "uuid",
  "tenderData": "Description: Software development services..."
}
```

**Response:**
```json
{
  "summary": {
    "summary": "Government seeking software development services...",
    "keyDetails": {
      "objective": "Custom software development",
      "category": "Information Technology", 
      "value": "$100K - $500K"
    },
    "requirements": [
      "5+ years experience",
      "Security clearance required"
    ],
    "recommendation": {
      "priority": "High",
      "reason": "Good fit for your expertise"
    }
  }
}
```

### Filter Tenders with AI
```http
POST /ai/filterTendersWithAI
```

**Request Body:**
```json
{
  "prompt": "software development projects",
  "tenderData": [...]
}
```

### Generate Leads
```http
POST /ai/generateLeads
```

**Request Body:**
```json
{
  "prompt": "Find IT consulting opportunities"
}
```

### RFP Analysis
```http
POST /ai/getRfpAnalysis
```

**Request Body:**
```json
{
  "rfpData": {
    "title": "...",
    "description": "...",
    "requirements": [...]
  }
}
```

---

## Data Scraping

**Base URL:** `http://localhost:4000/scraping`

### Supported Data Sources

- **Canadian Government** - Federal tender notices (CSV)
- **Toronto City** - City procurement system (JSON API)
- **Ontario Government** - Provincial tenders (Excel export)
- **Mississauga City** - Municipal tenders (JSON API)

### Canadian Government Tenders

#### Import Canadian Tenders
```http
POST /scraping/canadian
```

**Response:**
```json
{
  "message": "Canadian tenders imported successfully!",
  "count": 1247,
  "elasticsearch_synced": true
}
```

#### Check Import Status
```http
GET /scraping/canadian/status
```

**Response:**
```json
{
  "canImport": false,
  "message": "Rate limited - wait 18 hours",
  "hoursRemaining": 18,
  "lastImportAt": "2025-01-14T10:30:00.000Z"
}
```

### Toronto City Tenders

#### Import Toronto Tenders
```http
POST /scraping/toronto
```

#### Check Status
```http
GET /scraping/toronto/status
```

#### Test Scraping (No Import)
```http
GET /scraping/toronto/scrape
```

### Ontario Government Tenders

#### Import Ontario Tenders
```http
POST /scraping/ontario
```

#### Check Status
```http
GET /scraping/ontario/status
```

#### Test Scraping (No Import)
```http
GET /scraping/ontario/scrape
```

### Mississauga City Tenders

#### Import Mississauga Tenders
```http
POST /scraping/mississauga
```

#### Check Status
```http
GET /scraping/mississauga/status
```

#### Test Scraping (No Import)
```http
GET /scraping/mississauga/scrape
```

### Test Playground

#### Get Available Sources
```http
GET /scraping/test/sources
```

#### Test Specific Source
```http
GET /scraping/test/:source
```

**Available sources:** `canadian`, `toronto`, `ontario`, `mississauga`

### Test Playground Page
```http
GET /test
```

**Description:** HTML page for testing scraping tools with interactive interface.

---

## Subscription Management

**Base URL:** `http://localhost:4000/subscriptions`

### Create Checkout Session
```http
POST /subscriptions/checkout
```

**Request Body:**
```json
{
  "planId": "uuid",
  "userId": "uuid",
  "billingCycle": "monthly" // or "yearly"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### Get User Subscription
```http
GET /subscriptions/user/:userId
```

### Check Subscription Status
```http
GET /subscriptions/status/:userId
```

**Response:**
```json
{
  "isActive": true,
  "plan": "pro",
  "currentPeriodEnd": "2024-03-15T00:00:00Z"
}
```

### Cancel Subscription
```http
DELETE /subscriptions/user/:userId
```

### Billing Portal
```http
POST /subscriptions/billing-portal/:userId
```

**Response:**
```json
{
  "portalUrl": "https://billing.stripe.com/..."
}
```

### Get Available Plans
```http
GET /subscriptions/plans
```

**Response:**
```json
{
  "plans": [
    {
      "id": "uuid",
      "name": "Basic",
      "price_monthly": 29.99,
      "price_yearly": 299.99,
      "features": ["10 searches/month", "Basic AI summaries"]
    }
  ]
}
```

### Stripe Webhook
```http
POST /subscriptions/webhook
```

**Description:** Handles Stripe webhook events for subscription updates.

---

## Bookmarks & Profiles

### Bookmarks

**Base URL:** `http://localhost:4000/bookmarks`

#### Create/Update Bookmark
```http
POST /bookmarks/
```

**Request Body:**
```json
{
  "userId": "uuid",
  "tenderNoticeId": "uuid",
  "notes": "Interesting opportunity"
}
```

#### Remove Bookmark
```http
DELETE /bookmarks/:userId/:tenderNoticeId
```

#### Get User Bookmarks
```http
GET /bookmarks/user/:userId
```

#### Update Bookmark Notes
```http
PUT /bookmarks/:userId/:tenderNoticeId/notes
```

**Request Body:**
```json
{
  "notes": "Updated notes"
}
```

#### Check Bookmark Status
```http
GET /bookmarks/:userId/:tenderNoticeId/status
```

### Profiles

**Base URL:** `http://localhost:4000/profile`

#### Create/Update Profile
```http
POST /profile/
```

**Request Body:**
```json
{
  "id": "uuid",
  "company_name": "Acme Corp",
  "industry": "Technology",
  "company_size": "50-100",
  "primary_services": ["Software Development", "Consulting"],
  "service_regions": ["Ontario", "Quebec"],
  "government_experience": "5+ years",
  "typical_contract_size": "$100K-$500K"
}
```

#### Get User Profile
```http
GET /profile/:userId
```

---

## Chat System

**Base URL:** `http://localhost:4000/chat`

### Create Chat Session
```http
POST /chat/session
```

**Response:**
```json
{
  "sessionId": "uuid",
  "message": "Chat session created"
}
```

### Send Message
```http
POST /chat/session/:sessionId/message
```

**Request Body:**
```json
{
  "message": "What are the latest IT tenders?"
}
```

**Response:**
```json
{
  "message": "Here are the latest IT tenders...",
  "sessionId": "uuid"
}
```

### Delete Session
```http
DELETE /chat/session/:sessionId
```

---

## ML Backend Services

**Base URL:** `http://localhost:8000`

### Health Check
```http
GET /health
```

### Elasticsearch Operations

#### Search Tenders
```http
POST /elasticsearch/search
```

**Request Body:**
```json
{
  "query": "software development",
  "filters": {
    "source": ["canadian"],
    "status": ["open"]
  },
  "limit": 50
}
```

#### Sync to Elasticsearch
```http
POST /elasticsearch/sync
```

**Description:** Sync all tenders from Supabase to Elasticsearch.

#### Sync Single Tender
```http
POST /elasticsearch/sync/:tender_id
```

#### Get Sync Status
```http
GET /elasticsearch/status
```

#### Check Elasticsearch Health
```http
GET /elasticsearch/health
```

#### Create Search Index
```http
POST /elasticsearch/create-index
```

### Embeddings

#### Generate Query Embedding
```http
POST /embeddings/generate/query
```

**Request Body:**
```json
{
  "text": "software development services"
}
```

#### Generate Data Embeddings
```http
POST /embeddings/generate/data
```

**Request Body:**
```json
{
  "items": [
    {
      "id": "uuid",
      "text": "Software development tender..."
    }
  ]
}
```

### RFP Analysis

#### Summarize Text
```http
POST /rfp/summarize_text
```

**Request Body:**
```json
{
  "text": "Long RFP document text..."
}
```

---

## Data Schema

### Tender Object (tenders_new table)

```json
{
  "id": "uuid",
  "title": "Software Development Services",
  "description": "Detailed description...",
  "status": "open",
  "source": "canadian",
  "source_reference": "REF123456",
  "source_url": "https://...",
  "category_primary": "Information Technology", 
  "procurement_type": "Request for Proposal",
  "procurement_method": "Open Competition",
  "contracting_entity_name": "Government of Canada",
  "contracting_entity_city": "Ottawa",
  "contracting_entity_province": "Ontario",
  "contracting_entity_country": "Canada",
  "contact_name": "John Doe",
  "contact_email": "john.doe@canada.ca",
  "contact_phone": "+1-613-555-0123",
  "published_date": "2024-01-15T09:00:00Z",
  "closing_date": "2024-03-15T23:59:59Z",
  "contract_start_date": "2024-04-01T00:00:00Z",
  "estimated_value_min": 100000,
  "currency": "CAD",
  "delivery_location": "National",
  "gsin": "12345",
  "unspsc": "81112200",
  "plan_takers_count": 5,
  "submissions_count": 12,
  "summary": "AI-generated summary...",
  "embedding": "vector_data",
  "embedding_input": "text_used_for_embedding",
  "created_at": "2024-01-15T09:00:00Z",
  "updated_at": "2024-01-15T09:00:00Z",
  "last_scraped_at": "2024-01-15T09:00:00Z"
}
```

## Rate Limiting

- **Scraping endpoints**: 24-hour cooldown per source
- **AI endpoints**: Based on subscription plan
- **Search endpoints**: Rate limited per user

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Error description",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Main backend port | `4000` |
| `ML_BACKEND_PORT` | ML backend port | `8000` |
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Required |
| `GEMINI_API_KEY` | Google Gemini AI API key | Required |
| `STRIPE_SECRET_KEY` | Stripe secret key | Required |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Required |
| `ELASTICSEARCH_URL` | Elasticsearch cluster URL | Required |
| `OPEN_TENDER_NOTICES_URL` | Canadian CSV endpoint | Required |
| `DOWNLOAD_DIR` | Download directory | `./downloads` |

## Usage Examples

### Daily Data Import
```bash
# Import all sources
curl -X POST http://localhost:4000/scraping/canadian
curl -X POST http://localhost:4000/scraping/toronto  
curl -X POST http://localhost:4000/scraping/ontario
curl -X POST http://localhost:4000/scraping/mississauga
```

### AI-Powered Search
```bash
# Search for software tenders
curl -X POST http://localhost:4000/tenders/searchTenders \
  -H "Content-Type: application/json" \
  -d '{"query": "software development", "limit": 10}'
```

### User Management
```bash
# Create user
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Get user tenders
curl -H "Authorization: Bearer {token}" \
  http://localhost:4000/bookmarks/user/{userId}
```

---

*Last updated: January 2025*