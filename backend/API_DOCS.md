# Mapletenders Scraping API Documentation

## Overview

The Mapletenders backend provides a unified API for scraping tender data from multiple Canadian government sources. All scraping endpoints are consolidated under `/scraping/*` for easy management and consistent behavior.

## Base URL

```
http://localhost:4000/scraping
```

## Supported Data Sources

- **Canadian Government** - CSV export from federal tender notices
- **Toronto City** - JSON API from City of Toronto procurement system
- **Ontario Government** - Excel export from Ontario Tenders (Jaggaer platform)
- **Mississauga City** - JSON API from Mississauga bidsandtenders.ca portal

## Authentication

Currently no authentication required for scraping endpoints.

## Rate Limiting

All sources implement 24-hour rate limiting to prevent excessive requests:
- Only one import per source per 24 hours
- Status endpoints show remaining cooldown time
- Rate limits are shared across manual and automated imports

---

## Endpoints

### Mississauga City Tenders

#### Import Mississauga Tenders
```http
POST /scraping/mississauga
```

**Description:** Scrapes and imports Mississauga city tenders from their bidsandtenders.ca portal.

**Response:**
```json
{
  "message": "Mississauga tenders imported successfully",
  "count": 12
}
```

**Process:**
1. Uses stealth Puppeteer to bypass detection
2. Intercepts API calls from the tender portal
3. Transforms JSON data to canonical schema
4. Generates AI embeddings (with fallback)
5. Updates database

#### Check Mississauga Import Status
```http
GET /scraping/mississauga/status
```

**Response:**
```json
{
  "canImport": true,
  "message": "Ready to import"
}
```

#### Test Mississauga Scraping
```http
GET /scraping/mississauga/scrape
```

**Description:** Scrapes Mississauga tenders without importing (for testing).

**Response:**
```json
{
  "message": "Mississauga tenders scraped successfully",
  "count": 12,
  "data": [...]
}
```

---

## Endpoints

### Canadian Government Tenders

#### Import Canadian Tenders
```http
POST /scraping/canadian
```

**Description:** Downloads and imports Canadian federal government tenders from CSV source.

**Response:**
```json
{
  "message": "Canadian tenders imported successfully!",
  "count": 1247,
  "elasticsearch_synced": true
}
```

**Process:**
1. Downloads CSV from government endpoint
2. Transforms to canonical schema
3. Generates AI embeddings
4. Updates database with upsert (preserves bookmarks)
5. Generates AI summaries for first 10 tenders
6. Syncs to Elasticsearch for search

#### Check Canadian Import Status
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

---

### Toronto City Tenders

#### Import Toronto Tenders
```http
POST /scraping/toronto
```

**Description:** Scrapes and imports Toronto city tenders from their OData API.

**Response:**
```json
{
  "message": "Toronto tenders imported successfully",
  "count": 45
}
```

**Process:**
1. Uses Puppeteer to scrape Toronto API
2. Transforms to canonical schema
3. Generates AI embeddings (with fallback)
4. Updates database

#### Check Toronto Import Status
```http
GET /scraping/toronto/status
```

**Response:**
```json
{
  "canImport": true,
  "message": "Ready to import"
}
```

#### Test Toronto Scraping
```http
GET /scraping/toronto/scrape
```

**Description:** Scrapes Toronto tenders without importing (for testing).

**Response:**
```json
{
  "message": "Toronto tenders scraped successfully",
  "count": 45,
  "data": [...]
}
```

---

### Ontario Government Tenders

#### Import Ontario Tenders
```http
POST /scraping/ontario
```

**Description:** Downloads Excel export from Ontario Tenders and imports data.

**Response:**
```json
{
  "message": "Ontario tenders imported successfully",
  "count": 156
}
```

**Process:**
1. Uses Puppeteer to navigate to Ontario Tenders
2. Clicks export button to download Excel file
3. Parses XLSX and transforms to canonical schema
4. Generates AI embeddings (with fallback)
5. Updates database
6. Cleans up downloaded file

#### Check Ontario Import Status
```http
GET /scraping/ontario/status
```

**Response:**
```json
{
  "canImport": true,
  "message": "Ready to import"
}
```

#### Test Ontario Scraping
```http
GET /scraping/ontario/scrape
```

**Description:** Downloads and parses Ontario Excel without importing (for testing).

**Response:**
```json
{
  "message": "Ontario tenders scraped successfully",
  "count": 156,
  "data": [...]
}
```

---

## Data Schema

All scraped data is transformed to a canonical tender schema with these key fields:

| Field | Description |
|-------|-------------|
| `id` | Unique tender identifier |
| `title` | Tender title/name |
| `reference_number` | Official reference number |
| `publication_date` | When tender was published |
| `tender_closing_date` | Submission deadline |
| `tender_status` | Current status (Open, Closed, etc.) |
| `procurement_category` | Type of procurement |
| `contracting_entity_name` | Organization issuing tender |
| `contact_name` | Contact person |
| `contact_email` | Contact email |
| `tender_description` | Full description |
| `notice_url` | Link to original posting |
| `regions_of_opportunity` | Geographic scope |
| `source` | Data source ("canadian", "toronto", "ontario", "mississauga") |

## Field Mappings

### Canadian CSV → Canonical Schema
- `title-titre-eng` → `title`
- `referenceNumber-numeroReference` → `reference_number`
- `publicationDate-datePublication` → `publication_date`
- `tenderClosingDate-dateFermetureSoumission` → `tender_closing_date`
- *(Full bilingual mapping available)*

### Toronto API → Canonical Schema
- `Posting_Title` → `title`
- `Solicitation_Document_Number` → `reference_number`
- `Publish_Date` → `publication_date`
- `Closing_Date_Formatted` → `tender_closing_date`
- `Buyer_Name` → `contact_name`

### Ontario Excel → Canonical Schema
- `Project Title` → `title`
- `Project Code` → `reference_number`
- `Publication Date` → `publication_date`
- `Listing Expiry Date` → `tender_closing_date`
- `Contact` → `contact_name`

### Mississauga API → Canonical Schema
- `Title` → `title`
- `Id` → `id`
- `DateAvailable` → `publication_date` (parsed from .NET date format)
- `DateClosing` → `tender_closing_date` (parsed from .NET date format)
- `Status` → `tender_status`
- `Description` → `tender_description` (HTML cleaned)

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": "Failed to import Canadian tenders",
  "details": "Network timeout after 30 seconds"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `429` - Rate limited (too soon since last import)
- `500` - Server error (scraping failed, network issues, etc.)

## Features

### AI Integration
- **Embeddings**: Generates vector embeddings for AI-powered search
- **Summaries**: Creates AI summaries for recent tenders
- **Search**: Syncs to Elasticsearch for semantic search

### Data Quality
- **Validation**: Filters invalid records before import
- **Deduplication**: Uses upsert to prevent duplicates
- **Cleanup**: Removes stale tenders no longer in source data
- **Fallbacks**: Continues import even if AI features fail

### Performance
- **Batch Processing**: Handles large datasets efficiently
- **Rate Limiting**: Prevents overwhelming source systems
- **Concurrent Safety**: Prevents multiple imports running simultaneously
- **Cleanup**: Automatically removes temporary files

---

## Usage Examples

### Import All Sources Daily
```bash
# Canadian government tenders
curl -X POST http://localhost:4000/scraping/canadian

# Toronto city tenders  
curl -X POST http://localhost:4000/scraping/toronto

# Ontario government tenders
curl -X POST http://localhost:4000/scraping/ontario
```

### Check Status Before Import
```bash
# Check if ready to import
curl http://localhost:4000/scraping/canadian/status

# Import if allowed
if [ "$(curl -s http://localhost:4000/scraping/canadian/status | jq -r '.canImport')" = "true" ]; then
  curl -X POST http://localhost:4000/scraping/canadian
fi
```

### Test Scraping Without Importing
```bash
# Test Ontario scraping
curl http://localhost:4000/scraping/ontario/scrape

# Test Toronto scraping
curl http://localhost:4000/scraping/toronto/scrape
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPEN_TENDER_NOTICES_URL` | Canadian CSV endpoint | Required |
| `DOWNLOAD_DIR` | Directory for Ontario Excel downloads | `./downloads` |
| `PORT` | Server port | `4000` |

## Dependencies

- **Puppeteer**: Browser automation for Ontario/Toronto scraping
- **XLSX**: Excel file parsing for Ontario data
- **Papa Parse**: CSV parsing for Canadian data
- **Supabase**: Database storage
- **Elasticsearch**: Search indexing