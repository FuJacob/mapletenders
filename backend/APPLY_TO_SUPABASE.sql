-- CRITICAL: Apply this entire SQL script to your Supabase database
-- This will create the missing tables and functions that database.types.ts expects
-- Go to Supabase Dashboard > SQL Editor and run this entire script

-- Copy the entire analytics-schema.sql content here
-- Source: /Users/jacobfu/src/procuroo/backend/database/analytics-schema.sql

-- Analytics Database Schema for Mapletenders Dashboard
-- This schema supports ROI tracking, performance metrics, and user analytics

-- User Analytics aggregated by time periods
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Time period for this analytics record
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  
  -- Opportunity metrics
  opportunities_viewed INTEGER DEFAULT 0,
  opportunities_bookmarked INTEGER DEFAULT 0,
  opportunities_applied INTEGER DEFAULT 0,
  opportunities_won INTEGER DEFAULT 0,
  opportunities_lost INTEGER DEFAULT 0,
  total_opportunity_value DECIMAL(15,2) DEFAULT 0,
  won_opportunity_value DECIMAL(15,2) DEFAULT 0,
  
  -- Performance metrics  
  searches_performed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  ai_summaries_generated INTEGER DEFAULT 0,
  notifications_received INTEGER DEFAULT 0,
  notifications_acted_upon INTEGER DEFAULT 0,
  
  -- ROI calculations
  subscription_cost DECIMAL(10,2) DEFAULT 0,
  estimated_time_saved_hours DECIMAL(8,2) DEFAULT 0,
  manual_search_hours_avoided DECIMAL(8,2) DEFAULT 0,
  contracts_won_value DECIMAL(15,2) DEFAULT 0,
  estimated_roi_percentage DECIMAL(8,2) DEFAULT 0,
  
  -- Calculated metrics
  win_rate DECIMAL(5,2) DEFAULT 0,
  average_contract_value DECIMAL(15,2) DEFAULT 0,
  response_time_hours DECIMAL(8,2) DEFAULT 0,
  efficiency_score INTEGER DEFAULT 0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique period per user
  UNIQUE(user_id, period_start, period_end, period_type)
);

-- User Activity Log for tracking all user interactions
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity details
  action_type VARCHAR(50) NOT NULL, -- 'search', 'view', 'bookmark', 'apply', etc.
  resource_type VARCHAR(50), -- 'tender', 'search', 'dashboard', etc.
  resource_id UUID, -- ID of the resource being acted upon
  
  -- Request context
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  
  -- Performance tracking
  duration_seconds INTEGER, -- How long the action took
  page_url TEXT,
  referrer_url TEXT,
  response_time_ms INTEGER,
  
  -- Additional data storage
  metadata JSONB,
  
  -- Timestamps
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tender Performance Tracking
CREATE TABLE IF NOT EXISTS tender_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
  
  -- Tender info (denormalized for performance)
  tender_title TEXT,
  tender_value DECIMAL(15,2),
  tender_source VARCHAR(100),
  closing_date TIMESTAMP WITH TIME ZONE,
  
  -- User engagement tracking
  first_viewed_at TIMESTAMP WITH TIME ZONE,
  bookmarked_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE,
  
  -- Application details
  status VARCHAR(20) DEFAULT 'viewed' CHECK (status IN ('viewed', 'bookmarked', 'applied', 'won', 'lost')),
  outcome_date TIMESTAMP WITH TIME ZONE,
  
  -- Financial tracking
  final_contract_value DECIMAL(15,2),
  estimated_competitors INTEGER,
  actual_competitors INTEGER,
  our_bid_amount DECIMAL(15,2),
  winning_bid_amount DECIMAL(15,2),
  
  -- Performance metrics
  time_to_application_hours DECIMAL(8,2), -- Time from first view to application
  preparation_hours DECIMAL(8,2), -- Time spent preparing proposal
  win_probability_score INTEGER CHECK (win_probability_score BETWEEN 0 AND 100),
  
  -- Notes and learning
  outcome_notes TEXT,
  lessons_learned TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique tracking per user-tender pair
  UNIQUE(user_id, tender_id)
);

-- Dashboard Preferences
CREATE TABLE IF NOT EXISTS dashboard_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Widget configuration
  enabled_widgets TEXT[] DEFAULT ARRAY['stats', 'roi', 'timeline', 'performance', 'alerts'],
  widget_order INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5],
  default_time_period VARCHAR(20) DEFAULT 'monthly' CHECK (default_time_period IN ('daily', 'weekly', 'monthly', 'yearly')),
  
  -- Display preferences
  show_financial_metrics BOOLEAN DEFAULT true,
  show_performance_charts BOOLEAN DEFAULT true,
  show_competitor_analysis BOOLEAN DEFAULT false,
  
  -- Alert preferences
  alert_on_new_opportunities BOOLEAN DEFAULT true,
  alert_on_deadlines BOOLEAN DEFAULT true,
  alert_on_won_contracts BOOLEAN DEFAULT true,
  deadline_warning_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
  
  -- ROI calculation preferences
  hourly_rate DECIMAL(8,2) DEFAULT 75.00,
  manual_search_hours_per_opportunity DECIMAL(4,2) DEFAULT 2.5,
  include_indirect_benefits BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Intelligence Data
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Time period for this intelligence data
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Market segmentation
  industry VARCHAR(100),
  province VARCHAR(50),
  entity_type VARCHAR(50), -- 'federal', 'provincial', 'municipal', 'crown_corp'
  
  -- Market metrics
  total_opportunities INTEGER DEFAULT 0,
  total_opportunity_value DECIMAL(15,2) DEFAULT 0,
  average_opportunity_value DECIMAL(15,2) DEFAULT 0,
  median_opportunity_value DECIMAL(15,2) DEFAULT 0,
  
  -- Competition metrics
  average_bidders_per_opportunity DECIMAL(4,2) DEFAULT 0,
  win_rate_benchmark DECIMAL(5,2) DEFAULT 0,
  average_contract_duration_days INTEGER DEFAULT 0,
  
  -- Trend data
  opportunity_growth_rate DECIMAL(5,2) DEFAULT 0,
  value_growth_rate DECIMAL(5,2) DEFAULT 0,
  competition_intensity_score INTEGER DEFAULT 0,
  
  -- Timestamps
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique periods per market segment
  UNIQUE(period_start, period_end, industry, province, entity_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_period ON user_analytics(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_timestamp ON user_activity_log(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_tender_performance_user_status ON tender_performance(user_id, status);
CREATE INDEX IF NOT EXISTS idx_market_intelligence_period_industry ON market_intelligence(period_start, industry);

-- RLS Policies
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tender_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analytics data
CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics" ON user_analytics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analytics" ON user_analytics FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity log" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity log" ON user_activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own performance data" ON tender_performance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own performance data" ON tender_performance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own performance data" ON tender_performance FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON dashboard_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON dashboard_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON dashboard_preferences FOR UPDATE USING (auth.uid() = user_id);

-- Market intelligence is publicly readable but only admin writable
CREATE POLICY "Anyone can view market intelligence" ON market_intelligence FOR SELECT USING (true);

-- Database Functions
CREATE OR REPLACE FUNCTION calculate_user_roi(
  target_user_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (
  total_investment DECIMAL(15,2),
  total_return DECIMAL(15,2),
  roi_percentage DECIMAL(8,2),
  time_saved_hours DECIMAL(8,2),
  time_saved_value DECIMAL(15,2),
  contracts_won INTEGER,
  contracts_won_value DECIMAL(15,2)
) AS $$
DECLARE
  user_prefs RECORD;
  analytics_data RECORD;
  subscription_cost DECIMAL(10,2) := 99.00; -- Monthly subscription cost
BEGIN
  -- Get user preferences for calculations
  SELECT 
    hourly_rate,
    manual_search_hours_per_opportunity,
    include_indirect_benefits
  INTO user_prefs
  FROM dashboard_preferences 
  WHERE user_id = target_user_id;
  
  -- Set defaults if no preferences found
  IF user_prefs IS NULL THEN
    user_prefs.hourly_rate := 75.00;
    user_prefs.manual_search_hours_per_opportunity := 2.5;
    user_prefs.include_indirect_benefits := true;
  END IF;
  
  -- Get aggregated analytics data for the period
  SELECT 
    COALESCE(SUM(opportunities_viewed), 0) as total_viewed,
    COALESCE(SUM(opportunities_bookmarked), 0) as total_bookmarked,
    COALESCE(SUM(opportunities_applied), 0) as total_applied,
    COALESCE(SUM(opportunities_won), 0) as total_won,
    COALESCE(SUM(contracts_won_value), 0) as total_contracts_value,
    COALESCE(SUM(estimated_time_saved_hours), 0) as total_time_saved,
    COALESCE(SUM(subscription_cost), 0) as total_subscription_cost
  INTO analytics_data
  FROM user_analytics 
  WHERE user_id = target_user_id 
    AND period_start >= start_date 
    AND period_end <= end_date;
    
  -- Calculate ROI components
  total_investment := COALESCE(analytics_data.total_subscription_cost, subscription_cost);
  contracts_won := analytics_data.total_won;
  contracts_won_value := analytics_data.total_contracts_value;
  
  -- Calculate time savings
  time_saved_hours := GREATEST(
    analytics_data.total_time_saved,
    analytics_data.total_viewed * user_prefs.manual_search_hours_per_opportunity
  );
  
  time_saved_value := time_saved_hours * user_prefs.hourly_rate;
  
  -- Total return includes contract value + time savings value
  total_return := contracts_won_value;
  IF user_prefs.include_indirect_benefits THEN
    total_return := total_return + time_saved_value;
  END IF;
  
  -- Calculate ROI percentage
  IF total_investment > 0 THEN
    roi_percentage := ((total_return - total_investment) / total_investment) * 100;
  ELSE
    roi_percentage := 0;
  END IF;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_dashboard_summary(
  target_user_id UUID,
  time_period VARCHAR(20) DEFAULT 'monthly'
)
RETURNS TABLE (
  total_opportunities INTEGER,
  new_today INTEGER,
  expiring_soon INTEGER,
  bookmarked INTEGER,
  applied INTEGER,
  won INTEGER,
  total_value DECIMAL(15,2),
  win_rate DECIMAL(5,2),
  avg_response_time DECIMAL(8,2),
  roi_percentage DECIMAL(8,2)
) AS $$
DECLARE
  period_start_calc TIMESTAMP WITH TIME ZONE;
  period_end_calc TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate period boundaries
  period_end_calc := NOW();
  
  CASE time_period
    WHEN 'daily' THEN
      period_start_calc := DATE_TRUNC('day', NOW());
    WHEN 'weekly' THEN
      period_start_calc := DATE_TRUNC('week', NOW());
    WHEN 'yearly' THEN
      period_start_calc := DATE_TRUNC('year', NOW());
    ELSE -- monthly default
      period_start_calc := DATE_TRUNC('month', NOW());
  END CASE;
  
  -- Get summary metrics
  SELECT 
    -- Opportunity counts
    (SELECT COUNT(*) FROM tenders)::INTEGER as total_opps,
    (SELECT COUNT(*) 
     FROM tenders 
     WHERE published_date >= CURRENT_DATE - INTERVAL '1 day')::INTEGER as new_today_count,
    (SELECT COUNT(*) 
     FROM tenders 
     WHERE closing_date BETWEEN NOW() AND NOW() + INTERVAL '7 days')::INTEGER as expiring_count,
    (SELECT COUNT(*) 
     FROM bookmarks 
     WHERE user_id = target_user_id AND status = 'active')::INTEGER as bookmarked_count,
    (SELECT COUNT(*) 
     FROM tender_performance 
     WHERE user_id = target_user_id AND status = 'applied')::INTEGER as applied_count,
    (SELECT COUNT(*) 
     FROM tender_performance 
     WHERE user_id = target_user_id AND status = 'won')::INTEGER as won_count,
    
    -- Financial metrics
    COALESCE((SELECT SUM(final_contract_value) 
              FROM tender_performance 
              WHERE user_id = target_user_id AND status = 'won'), 0) as total_val,
    
    -- Performance metrics
    CASE 
      WHEN (SELECT COUNT(*) FROM tender_performance WHERE user_id = target_user_id AND status IN ('applied', 'won', 'lost')) > 0
      THEN (SELECT (COUNT(*) FILTER (WHERE status = 'won') * 100.0 / 
                   COUNT(*) FILTER (WHERE status IN ('applied', 'won', 'lost')))
            FROM tender_performance 
            WHERE user_id = target_user_id)
      ELSE 0
    END as win_rate_calc,
    
    COALESCE((SELECT AVG(time_to_application_hours) 
              FROM tender_performance 
              WHERE user_id = target_user_id AND time_to_application_hours IS NOT NULL), 0) as avg_response,
    
    -- ROI from the calculation function
    COALESCE((SELECT roi_percentage 
              FROM calculate_user_roi(target_user_id, period_start_calc, period_end_calc) 
              LIMIT 1), 0) as roi_calc
  
  INTO 
    total_opportunities,
    new_today,
    expiring_soon,
    bookmarked,
    applied,
    won,
    total_value,
    win_rate,
    avg_response_time,
    roi_percentage;
    
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for functions
COMMENT ON FUNCTION calculate_user_roi IS 'Calculate comprehensive ROI for a user over a time period';
COMMENT ON FUNCTION get_dashboard_summary IS 'Get key dashboard metrics for a user';

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION calculate_user_roi TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_summary TO authenticated;

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tender_performance_updated_at BEFORE UPDATE ON tender_performance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_preferences_updated_at BEFORE UPDATE ON dashboard_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_intelligence_updated_at BEFORE UPDATE ON market_intelligence
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();