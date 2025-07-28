# 🚀 EXTERNAL ACTIONS REQUIRED FOR MAPLETENDERS LAUNCH

This document contains **critical actions that must be completed outside of the codebase** to ensure successful deployment and launch of Mapletenders.

---

## 📊 DATABASE SETUP & MIGRATION

### 1. Apply Database Schema Migrations to Production
**Priority: HIGH - Required for all new features**

```bash
# Connect to your Supabase/PostgreSQL database and run in order:

# 1. Analytics schema (COMPLETED)
psql -h [your-db-host] -U [username] -d [database-name] -f backend/database/analytics-schema.sql

# 2. Advanced Search schema (NEW)
psql -h [your-db-host] -U [username] -d [database-name] -f backend/sql/create_saved_searches_table.sql

# 3. Notifications schema (NEW)
psql -h [your-db-host] -U [username] -d [database-name] -f backend/sql/create_notifications_tables.sql
```

**What this does:**
- ✅ Creates analytics tables (`user_analytics`, `user_activity_log`, `tender_performance`)
- ✅ Adds ROI calculation functions and automated triggers
- 🆕 Creates saved searches (`saved_searches`, `search_performance`)
- 🆕 Creates notification system (`notifications`, `notification_preferences`, `deadline_alerts`)
- 🆕 Sets up multi-channel notification framework

**Verification:**
- Check that all tables exist: `\dt` in psql
- Test ROI function: `SELECT * FROM calculate_user_roi('user-id', '2024-01-01', '2024-12-31');`
- Test saved searches: `SELECT * FROM saved_searches LIMIT 1;`
- Test notifications: `SELECT * FROM notification_channels;`

---

## 🔑 ENVIRONMENT VARIABLES & SECRETS

### 2. Update Production Environment Variables
**Priority: HIGH - Required for analytics API**

Add to your production environment (Vercel, Heroku, AWS, etc.):

```bash
# Backend Environment Variables
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_google_gemini_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
ELASTICSEARCH_URL=your_elasticsearch_cluster_url
FRONTEND_URL=https://your-frontend-domain.com

# Frontend Environment Variables
VITE_API_BASE_URL=https://your-backend-api.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🔍 ELASTICSEARCH SETUP

### 3. Configure Elasticsearch for Advanced Search
**Priority: HIGH - Required for Week 3-4 features**

**Option A: Elasticsearch Cloud (Recommended)**
1. Sign up at https://cloud.elastic.co/
2. Create a new deployment (choose Canada Central region)
3. Note the cluster URL and credentials
4. Update `ELASTICSEARCH_URL` environment variable

**Option B: Self-hosted**
1. Install Elasticsearch 8.x
2. Configure cluster with Canadian data residency
3. Set up security and authentication
4. Create tender search index

**Required Index Mapping:**
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

## 📧 EMAIL & NOTIFICATION SERVICES

### 4. Set Up Notification Services
**Priority: MEDIUM - Required for Week 5-6 features**

**Resend Email (Already configured)**
- ✅ Already set up for transactional emails
- Verify sending domain is configured
- Check DKIM/SPF records

**SMS Notifications (Twilio)**
```bash
# Environment variables to add:
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Slack/Teams Integration**
- Create Slack app at https://api.slack.com/apps
- Enable incoming webhooks
- Store webhook URLs in user preferences

---

## 🗃️ DATA SOURCES & SCRAPING

### 5. Government Data Source Access
**Priority: HIGH - Core platform functionality**

**Canadian Government APIs:**
- Verify access to MERX API
- Confirm PWGSC data feed permissions
- Test provincial tender feeds (ON, BC, QC)

**Rate Limiting & Compliance:**
- Implement 24-hour scraping intervals
- Add retry mechanisms with exponential backoff
- Ensure compliance with robots.txt
- Set up monitoring for scraping failures

---

## 🔒 SECURITY & COMPLIANCE

### 6. Security Audit & Compliance
**Priority: HIGH - Required before launch**

**SSL/TLS Setup:**
- Ensure HTTPS on all domains
- Configure proper certificates
- Set up HSTS headers

**Privacy Compliance (PIPEDA):**
- Review data collection practices
- Update privacy policy with analytics tracking
- Implement data retention policies
- Set up user data export/deletion

**Security Headers:**
```nginx
# Add to your web server config
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

---

## 📈 MONITORING & ANALYTICS

### 7. Production Monitoring Setup
**Priority: MEDIUM - Required for operational visibility**

**Application Monitoring:**
- Set up Sentry for error tracking
- Configure New Relic or DataDog for APM
- Set up uptime monitoring (Pingdom)

**Business Analytics:**
- Google Analytics 4 setup
- Conversion tracking for signups/payments
- Customer success metrics dashboard

**Infrastructure Monitoring:**
- Database performance monitoring
- API response time tracking
- Resource usage alerts

---

## 🚀 DEPLOYMENT & INFRASTRUCTURE

### 8. Production Deployment Pipeline
**Priority: HIGH - Required for launch**

**Backend Deployment:**
- Set up production server (AWS, GCP, or DigitalOcean)
- Configure Docker containers
- Set up load balancer
- Configure auto-scaling

**Frontend Deployment:**
- Deploy to Vercel (recommended) or Netlify
- Configure custom domain
- Set up CDN for static assets

**Database Backup:**
- Set up automated daily backups
- Test restore procedures
- Configure point-in-time recovery

---

## 💳 PAYMENT & BILLING

### 9. Stripe Production Configuration
**Priority: HIGH - Required for revenue**

**Stripe Setup:**
- Activate Stripe account for Canada
- Configure tax collection (HST/GST)
- Set up subscription webhooks
- Test payment flows end-to-end

**Invoice Configuration:**
- Configure Canadian tax settings
- Set up automatic invoice generation
- Configure failed payment handling

---

## 🧪 TESTING & QA

### 10. Pre-Launch Testing
**Priority: HIGH - Quality assurance**

**Load Testing:**
- Test with 1,000+ concurrent users
- Verify database performance under load
- Test search response times
- Validate analytics calculations

**User Acceptance Testing:**
- Test complete user journey
- Verify ROI calculations accuracy
- Test all payment flows
- Validate email notifications

---

## 📅 LAUNCH TIMELINE

### Week 1-2: Infrastructure Setup
- [ ] Database migration
- [ ] Environment variables
- [ ] Elasticsearch configuration
- [ ] SSL/security setup

### Week 3-4: Services Integration
- [ ] Notification services
- [ ] Data source validation
- [ ] Monitoring setup
- [ ] Backup procedures

### Week 5-6: Testing & Optimization
- [ ] Load testing
- [ ] Security audit
- [ ] User acceptance testing
- [ ] Performance optimization

### Week 7-8: Launch Preparation
- [ ] Final deployment
- [ ] DNS configuration
- [ ] Launch marketing assets
- [ ] Customer support setup

---

## 🆘 CRITICAL PATH ITEMS

**Must Complete Before Any Customer Access:**
1. ✅ Analytics schema migration
2. ⏳ Elasticsearch setup
3. ⏳ Production environment variables
4. ⏳ SSL/security configuration
5. ⏳ Stripe production setup

**Must Complete Before Public Launch:**
1. ⏳ Load testing
2. ⏳ Security audit
3. ⏳ Backup procedures
4. ⏳ Monitoring setup
5. ⏳ Legal compliance review

---

## 📞 SUPPORT CONTACTS

**Technical Issues:**
- Database: Contact your Supabase support
- Search: Elasticsearch support team
- Payments: Stripe support

**Emergency Contacts:**
- Production outages: [Your DevOps team]
- Security incidents: [Your security team]
- Customer issues: [Your support team]

---

*This document should be updated as each action is completed. Mark items as ✅ when finished.*

**Last Updated:** January 2025
**Next Review:** Before each weekly milestone