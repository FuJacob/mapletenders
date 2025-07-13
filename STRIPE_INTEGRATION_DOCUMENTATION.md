# Stripe Integration Documentation

## Overview

This document provides a comprehensive overview of the Stripe subscription integration implemented in the Procuroo application. The integration enables users to subscribe to different pricing plans with monthly/yearly billing cycles, including a 14-day free trial period.

## Architecture Overview

The Stripe integration follows a standard pattern with the following components:

1. **Backend Services** - Handle Stripe API interactions and database operations
2. **Frontend Components** - Manage user interface for pricing and subscription flows  
3. **Database Models** - Store subscription and plan data
4. **Webhook Handler** - Process Stripe events for subscription updates

## Database Schema

### Plans Table
Located in `backend/database.types.ts:77-118`

```typescript
plans: {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  stripe_product_id: string | null
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  features: Json | null
  limits: Json | null
  created_at: string | null
  updated_at: string | null
}
```

### Subscriptions Table  
Located in `backend/database.types.ts:179-234`

```typescript
subscriptions: {
  id: string
  user_id: string | null
  plan_id: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  billing_cycle: string
  trial_end: string | null
  usage_limits: Json | null
  created_at: string | null
  updated_at: string | null
}
```

## Backend Implementation

### SubscriptionService (`backend/services/subscriptionService.ts`)

**Core Responsibilities:**
- Stripe customer creation and management
- Subscription lifecycle management
- Webhook event processing
- Database synchronization

**Key Methods:**

#### Customer Management
- `createCustomer(email, name?, userId?)` - Creates Stripe customer with metadata
- `createBillingPortalSession(customerId, returnUrl)` - Generates billing portal access

#### Subscription Management
- `createSubscription(customerId, priceId, userId, planId, billingCycle)` - Creates subscription with 14-day trial
- `createCheckoutSession(customerId, priceId, userId, planId, successUrl, cancelUrl)` - Generates Stripe Checkout session
- `cancelSubscription(subscriptionId)` - Cancels subscription and updates database
- `updateSubscriptionStatus(stripeSubscriptionId, status, currentPeriodStart?, currentPeriodEnd?)` - Updates subscription from webhooks

#### Database Operations
- `saveSubscriptionToDatabase(stripeSubscription, userId, planId, billingCycle)` - Saves subscription data to local database
- `getUserSubscription(userId)` - Retrieves user's subscription with plan details
- `hasActiveSubscription(userId)` - Checks if user has active/trialing subscription

#### Webhook Handlers
- `verifyWebhookSignature(payload, signature)` - Validates Stripe webhook signatures
- `handleSubscriptionUpdated(subscription)` - Processes subscription update events
- `handleSubscriptionDeleted(subscription)` - Processes subscription cancellation events
- `handleInvoicePaymentSucceeded(invoice)` - Processes successful payment events
- `handleInvoicePaymentFailed(invoice)` - Processes failed payment events

### SubscriptionController (`backend/controllers/subscriptionController.ts`)

**API Endpoints:**

#### POST /subscriptions/checkout
Creates Stripe checkout session for subscription purchase.

**Request Body:**
```typescript
{
  planId: string
  billingCycle: "monthly" | "yearly"
  userId: string
  email: string
  name?: string
}
```

**Response:**
```typescript
{
  sessionId: string
  url: string
}
```

#### GET /subscriptions/user/:userId
Retrieves user's current subscription details.

#### GET /subscriptions/status/:userId
Checks subscription status and returns boolean + details.

#### DELETE /subscriptions/user/:userId
Cancels user's active subscription.

#### POST /subscriptions/billing-portal/:userId
Creates Stripe billing portal session for subscription management.

#### GET /subscriptions/plans
Returns all available subscription plans.

#### POST /subscriptions/webhook
Handles Stripe webhook events with signature verification.

### Database Service Integration (`backend/services/databaseService.ts:541-679`)

**Subscription Methods:**
- `createSubscription(subscriptionData)` - Upserts subscription record
- `getSubscriptionByUserId(userId)` - Retrieves subscription with plan join
- `updateSubscriptionByStripeId(stripeSubscriptionId, updateData)` - Updates subscription by Stripe ID
- `getSubscriptionByStripeId(stripeSubscriptionId)` - Finds subscription by Stripe ID

**Plan Methods:**
- `getPlan(planId)` - Retrieves single plan details
- `getAllPlans()` - Returns all plans ordered by monthly price
- `createPlan(planData)` - Creates new subscription plan
- `updatePlan(planId, updateData)` - Updates existing plan

### API Routes (`backend/routes/subscriptions.ts`)

Defines RESTful routes for subscription operations:

- `POST /checkout` - Create checkout session
- `GET /user/:userId` - Get user subscription  
- `GET /status/:userId` - Check subscription status
- `DELETE /user/:userId` - Cancel subscription
- `POST /billing-portal/:userId` - Create billing portal
- `GET /plans` - Get all plans
- `POST /webhook` - Handle Stripe webhooks (with raw body parser)

## Frontend Implementation

### API Client (`frontend/src/api/subscriptions.ts`)

**TypeScript Interfaces:**
```typescript
interface Plan {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  stripe_product_id: string | null
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  features: PlanFeatures
  limits: PlanLimits
  created_at: string | null
  updated_at: string | null
}

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  current_period_start: string | null
  current_period_end: string | null
  billing_cycle: string
  trial_end: string | null
  usage_limits: UsageLimits | null
  created_at: string | null
  updated_at: string | null
  plan?: Plan
}
```

**API Functions:**
- `createCheckoutSession(planId, billingCycle, userId, email, name?)` - Initiates subscription checkout
- `getUserSubscription(userId)` - Fetches user subscription data
- `checkSubscriptionStatus(userId)` - Checks active subscription status
- `cancelSubscription(userId)` - Cancels user subscription
- `createBillingPortalSession(userId)` - Creates billing management session
- `getPlans()` - Retrieves available plans

### Pricing Page (`frontend/src/pages/Pricing.tsx`)

**Features:**
- Dynamic pricing display with monthly/yearly toggle
- 17% discount calculation for yearly billing
- Plan comparison table
- Integration with authentication state
- Automatic checkout flow for authenticated users
- Redirect to signup for unauthenticated users

**Pricing Tiers (Hardcoded):**
1. **Starter** - $49/month, $490/year
2. **Professional** - $149/month, $1490/year (Most Popular)
3. **Enterprise** - $499/month, $4990/year (Contact Sales)

**Key Features:**
- Responsive design with mobile support
- Feature comparison matrix
- FAQ section
- Social proof elements
- Clear call-to-action buttons

### Subscription Success Page (`frontend/src/pages/SubscriptionSuccess.tsx`)

**Features:**
- Success confirmation after Stripe checkout
- Session ID display for reference
- Loading state while webhook processes
- Clear next steps with navigation
- Trial activation confirmation

## Subscription Flow

### New User Subscription Flow

1. **User browses pricing** → `frontend/src/pages/Pricing.tsx`
2. **User selects plan** → Checks authentication status
3. **If not authenticated** → Redirects to signup with plan parameters
4. **If authenticated** → Calls `createCheckoutSession()` API
5. **Backend creates Stripe session** → `SubscriptionService.createCheckoutSession()`
6. **User redirected to Stripe Checkout** → External Stripe payment flow
7. **Payment completed** → Stripe redirects to success page
8. **Webhook received** → `SubscriptionController.handleWebhook()`
9. **Subscription created** → Database updated with subscription details
10. **User sees success page** → `frontend/src/pages/SubscriptionSuccess.tsx`

### Webhook Event Processing

**Supported Events:**
- `customer.subscription.created` → Initial subscription setup
- `customer.subscription.updated` → Subscription changes (renewals, upgrades)
- `customer.subscription.deleted` → Subscription cancellations
- `invoice.payment_succeeded` → Successful payment processing
- `invoice.payment_failed` → Failed payment handling

**Event Flow:**
1. Stripe sends webhook to `/subscriptions/webhook`
2. Signature verification using `STRIPE_WEBHOOK_SECRET`
3. Event type routing to appropriate handler method
4. Database updates via `DatabaseService`
5. Response confirmation to Stripe

### Subscription Management

**User Actions:**
- **View subscription** → API call to `/subscriptions/user/:userId`
- **Cancel subscription** → API call to `DELETE /subscriptions/user/:userId`
- **Manage billing** → Redirect to Stripe billing portal
- **Upgrade/downgrade** → Through Stripe billing portal

## Environment Variables

**Required Environment Variables:**

### Backend
```bash
STRIPE_SECRET_KEY=sk_test_... # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret
FRONTEND_URL=http://localhost:3000 # For redirect URLs
```

### Frontend
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_... # Stripe publishable key (if needed for client-side)
```

## Security Considerations

### Webhook Security
- **Signature Verification** → All webhooks verified using `stripe.webhooks.constructEvent()`
- **Raw Body Parser** → Webhook endpoint uses `express.raw()` for proper signature validation
- **Secret Management** → Webhook secrets stored as environment variables

### Data Protection
- **Customer Data** → Minimal customer data stored locally, Stripe handles sensitive payment info
- **User Metadata** → User IDs stored in Stripe customer metadata for cross-reference
- **Subscription Status** → Local database maintains subscription state for application logic

### Access Control
- **User Authentication** → All subscription endpoints require user authentication
- **Data Isolation** → Users can only access their own subscription data
- **Admin Operations** → Plan management requires appropriate permissions

## Error Handling

### Frontend Error Handling
- **API Errors** → Standardized error responses with user-friendly messages
- **Network Failures** → Graceful degradation with retry mechanisms
- **Authentication Errors** → Automatic redirect to login page

### Backend Error Handling
- **Stripe API Errors** → Proper error catching and logging
- **Database Errors** → Transaction rollback on failures
- **Webhook Failures** → Error logging without breaking webhook processing

## Testing Strategy

### Test Coverage Areas
1. **Unit Tests** → Individual service methods
2. **Integration Tests** → API endpoint functionality
3. **Webhook Tests** → Event processing validation
4. **E2E Tests** → Complete subscription flows

### Test Data
- **Test Plans** → Use Stripe test mode for development
- **Mock Webhooks** → Stripe CLI for webhook testing
- **Test Cards** → Stripe test card numbers for payment testing

## Deployment Considerations

### Database Migrations
- **Plan Setup** → Ensure plans table populated with correct Stripe IDs
- **Subscription Indexes** → Database indexes on user_id and stripe_subscription_id
- **Data Consistency** → Regular sync between Stripe and local database

### Monitoring
- **Webhook Reliability** → Monitor webhook delivery success rates
- **Payment Failures** → Alert on failed payments for customer outreach
- **Subscription Metrics** → Track MRR, churn, and conversion rates

### Backup Strategy
- **Database Backups** → Regular backups of subscription data
- **Stripe Data Export** → Periodic exports of Stripe data for compliance
- **Audit Logs** → Maintain logs of all subscription-related operations

## Future Enhancements

### Planned Features
1. **Proration Handling** → Mid-cycle plan changes with prorated billing
2. **Usage-Based Billing** → Metered billing for API calls or searches
3. **Team Management** → Multi-user subscriptions with seat management
4. **Discount Codes** → Promotional pricing and referral programs
5. **Invoice Customization** → Branded invoices and custom billing details

### Technical Improvements
1. **Event Sourcing** → Comprehensive event logging for audit trails
2. **Rate Limiting** → API rate limiting based on subscription tiers
3. **Analytics Integration** → Revenue analytics and cohort analysis
4. **Multi-Currency** → Support for international pricing
5. **Tax Handling** → Automated tax calculation and compliance

## Troubleshooting Guide

### Common Issues

#### Webhook Not Processing
1. Check webhook endpoint URL configuration in Stripe
2. Verify `STRIPE_WEBHOOK_SECRET` environment variable
3. Ensure raw body parser middleware is configured
4. Check server logs for webhook signature errors

#### Subscription Creation Fails
1. Verify Stripe price IDs match plan configuration
2. Check customer creation for email/metadata issues
3. Ensure trial period configuration is correct
4. Validate database foreign key constraints

#### Payment Failures
1. Check Stripe Dashboard for specific payment error codes
2. Verify test card numbers are being used in development
3. Ensure payment method validation is properly configured
4. Check for insufficient funds or card restrictions

#### Database Sync Issues
1. Compare Stripe subscription data with local database
2. Check for failed webhook deliveries in Stripe
3. Verify subscription status updates are processing correctly
4. Run data consistency checks between systems

This documentation provides a complete overview of the Stripe integration implementation. For specific implementation details, refer to the individual source files mentioned throughout this document.