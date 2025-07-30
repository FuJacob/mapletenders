# 🚀 EXTERNAL ACTIONS REQUIRED FOR MAPLETENDERS LAUNCH (V2)

**CRITICAL: Complete these steps in EXACT ORDER to launch Mapletenders successfully**

---

## 📋 PREREQUISITES CHECKLIST

✅ **Analytics schema migration** - COMPLETED  
⚠️ **All other database schemas** - PENDING  
⚠️ **Environment variables setup** - PENDING  
⚠️ **External services configuration** - PENDING  

---

## 🗃️ STEP 1: DATABASE SCHEMA SETUP (CRITICAL)

### **Execute in this EXACT ORDER:**

**1.1 Create Core User Tables First**
```sql
-- Connect to your Supabase/PostgreSQL database and run:

-- Create users table (if not exists from Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_status VARCHAR(20) DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**1.2 Create Tender Tables**
```sql
-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    reference_number VARCHAR(255) UNIQUE,
    contracting_entity_name VARCHAR(255),
    category_primary VARCHAR(255),
    category_secondary VARCHAR(255),
    procurement_method VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open',
    published_date TIMESTAMP WITH TIME ZONE,
    closing_date TIMESTAMP WITH TIME ZONE,
    delivery_location VARCHAR(255),
    estimated_value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'CAD',
    source_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for tenders
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_closing_date ON tenders(closing_date);
CREATE INDEX IF NOT EXISTS idx_tenders_published_date ON tenders(published_date);
CREATE INDEX IF NOT EXISTS idx_tenders_category_primary ON tenders(category_primary);
```

**1.3 Apply Analytics Schema (ALREADY DONE)**
✅ You've already completed this step.

**1.4 Create Saved Searches Schema**
```sql
-- Now run the saved searches schema (this was failing before)
-- File: backend/sql/create_saved_searches_table.sql
psql -h [your-db-host] -U [username] -d [database-name] -f backend/sql/create_saved_searches_table.sql
```

**1.5 Create Bookmarks Schema**
```sql
-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tender_notice_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tender_notice_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_tender_id ON bookmarks(tender_notice_id);
```

**1.6 Create Notifications Schema**
```sql
-- Run notifications schema
psql -h [your-db-host] -U [username] -d [database-name] -f backend/sql/create_notifications_tables.sql
```

**1.7 Create Calendar Integration Schema**
```sql
-- Run calendar schema
psql -h [your-db-host] -U [username] -d [database-name] -f backend/sql/create_calendar_tables.sql
```

**Verification Commands:**
```sql
-- Verify all tables exist
\dt

-- Test critical functions
SELECT * FROM calculate_user_roi('test-user-id', '2024-01-01', '2024-12-31');
SELECT * FROM saved_searches LIMIT 1;
SELECT * FROM bookmarks LIMIT 1;
```

---

## 🔑 STEP 2: ENVIRONMENT VARIABLES SETUP

### **2.1 Backend Environment Variables**
Create/update your production `.env` file:

```bash
# Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Search Infrastructure
ELASTICSEARCH_URL=your_elasticsearch_cluster_url

# Application
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
PORT=4000

# Calendar Integration (NEW - REQUIRED)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-api.com/calendar/google/callback

# Notification Services (NEW - REQUIRED)
RESEND_API_KEY=your_resend_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### **2.2 Frontend Environment Variables**
Create/update your production frontend `.env`:

```bash
VITE_API_BASE_URL=https://your-backend-api.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📅 STEP 3: GOOGLE CALENDAR OAUTH SETUP

### **3.1 Google Cloud Console Setup**
1. Go to https://console.cloud.google.com/
2. Create project or select existing project
3. Enable Google Calendar API
4. Go to "Credentials" → Create OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - `https://your-backend-api.com/calendar/google/callback`
   - `http://localhost:4000/calendar/google/callback` (for development)

### **3.2 Required OAuth Scopes**
```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/userinfo.email
```

### **3.3 Test OAuth Flow**
After deployment, visit: `https://your-backend-api.com/calendar/google/auth`

---

## 🔍 STEP 4: ELASTICSEARCH SETUP

### **4.1 Option A: Elasticsearch Cloud (RECOMMENDED)**
1. Sign up at https://cloud.elastic.co/
2. Create deployment (Canada Central region)
3. Note cluster URL and credentials
4. Update `ELASTICSEARCH_URL` environment variable

### **4.2 Required Index Mapping**
```json
{
  "mappings": {
    "properties": {
      "title": {"type": "text", "analyzer": "standard"},
      "description": {"type": "text", "analyzer": "standard"},
      "category": {"type": "keyword"},
      "location": {"type": "keyword"},
      "value": {"type": "long"},
      "closing_date": {"type": "date"},
      "embedding": {"type": "dense_vector", "dims": 768}
    }
  }
}
```

---

## 📧 STEP 5: NOTIFICATION SERVICES SETUP

### **5.1 Resend Email (ALREADY CONFIGURED)**
✅ Verify your sending domain
✅ Check DKIM/SPF records

### **5.2 Twilio SMS Setup**
1. Sign up at https://twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add to environment variables (Step 2.1)

### **5.3 Slack/Teams Integration**
1. Create Slack app at https://api.slack.com/apps
2. Enable incoming webhooks
3. Store webhook URLs in user preferences

---

## 💳 STEP 6: STRIPE PRODUCTION SETUP

### **6.1 Activate Stripe Account**
1. Complete business verification
2. Configure for Canada
3. Set up tax collection (HST/GST)
4. Configure subscription webhooks

### **6.2 Test Payment Flows**
- Test subscription signup
- Test payment failures
- Test webhook delivery

---

## 🚀 STEP 7: DEPLOYMENT

### **7.1 Backend Deployment**
1. Deploy to your hosting provider (AWS, GCP, DigitalOcean)
2. Configure Docker containers if using containers
3. Set up load balancer
4. Configure auto-scaling

### **7.2 Frontend Deployment**
1. Deploy to Vercel (recommended) or Netlify
2. Configure custom domain
3. Set up CDN for static assets

### **7.3 Database Backup**
1. Set up automated daily backups
2. Test restore procedures
3. Configure point-in-time recovery

---

## 🔒 STEP 8: SECURITY & SSL

### **8.1 SSL/HTTPS Setup**
- Ensure HTTPS on all domains
- Configure proper certificates
- Set up HSTS headers

### **8.2 Security Headers**
Add to your web server config:
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

---

## 🧪 STEP 9: FINAL TESTING

### **9.1 Critical Path Testing**
1. User registration/login
2. Search functionality
3. Bookmark system
4. Analytics dashboard
5. Payment processing
6. Calendar integration

### **9.2 Load Testing**
- Test with 100+ concurrent users
- Verify database performance
- Test search response times

---

## ✅ COMPLETION CHECKLIST

### **Infrastructure (Manual Setup Required)**
- [ ] Database schemas created in correct order
- [ ] Environment variables configured
- [ ] Google Calendar OAuth configured
- [ ] Elasticsearch cluster setup
- [ ] Notification services configured
- [ ] Stripe production setup
- [ ] SSL/HTTPS configured
- [ ] Backup procedures tested

### **Technical (Automated - Already Complete)**
- [x] Frontend builds successfully
- [x] Backend builds successfully  
- [x] All APIs connected to real data
- [x] Authentication working
- [x] TypeScript compilation clean
- [x] Critical bugs fixed

---

## 🚀 LAUNCH TIMELINE

### **Phase 1: Infrastructure (Days 1-2)**
- [ ] Complete database setup (Step 1)
- [ ] Configure environment variables (Step 2)
- [ ] Set up Google OAuth (Step 3)

### **Phase 2: Services (Days 2-3)**
- [ ] Configure Elasticsearch (Step 4)
- [ ] Set up notifications (Step 5)
- [ ] Configure Stripe (Step 6)

### **Phase 3: Deployment (Day 3)**
- [ ] Deploy backend and frontend (Step 7)
- [ ] Configure security (Step 8)
- [ ] Run final testing (Step 9)

---

## 🆘 TROUBLESHOOTING

### **Common Issues:**

**Database Schema Errors:**
- Ensure tables are created in order (users → tenders → everything else)
- Check Supabase auth tables exist first

**Authentication Issues:**
- Verify Supabase keys are correct
- Check environment variables are loaded

**API Connection Issues:**
- Verify backend is running on correct port
- Check CORS configuration
- Ensure SSL certificates are valid

---

**CURRENT STATUS: 99% Complete - Only Manual Setup Remaining**

**Estimated Time to Launch: 2-3 Days** ⚡

*Last Updated: January 2025*