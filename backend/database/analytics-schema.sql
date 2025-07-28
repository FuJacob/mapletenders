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

-- User activity log for detailed tracking
CREATE TABLE IF NOT EXISTS user_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Activity details
  action_type VARCHAR(50) NOT NULL, -- 'view_tender', 'bookmark', 'search', 'apply', 'win', 'lose'
  resource_type VARCHAR(50), -- 'tender', 'search', 'notification', 'analytics'
  resource_id UUID, -- ID of the resource (tender_id, search_id, etc.)
  
  -- Activity metadata
  metadata JSONB, -- Additional activity-specific data
  session_id VARCHAR(100), -- Track user sessions
  ip_address INET,
  user_agent TEXT,
  
  -- Timing information
  duration_seconds INTEGER, -- How long the action took
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Location context
  page_url TEXT,
  referrer_url TEXT,
  
  -- Performance tracking
  response_time_ms INTEGER, -- API response time
  
  -- Indexes for fast queries
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tender performance tracking (for ROI calculations)
CREATE TABLE IF NOT EXISTS tender_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tender_id UUID, -- May reference tenders_enhanced or be external
  
  -- Tender details
  tender_title TEXT,
  tender_value DECIMAL(15,2),
  tender_source VARCHAR(50),
  closing_date TIMESTAMP WITH TIME ZONE,
  
  -- User engagement
  first_viewed_at TIMESTAMP WITH TIME ZONE,
  bookmarked_at TIMESTAMP WITH TIME ZONE,
  applied_at TIMESTAMP WITH TIME ZONE,
  
  -- Outcome tracking
  status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'applied', 'won', 'lost', 'cancelled'
  outcome_date TIMESTAMP WITH TIME ZONE,
  final_contract_value DECIMAL(15,2),
  
  -- Competition analysis
  estimated_competitors INTEGER,
  actual_competitors INTEGER,
  our_bid_amount DECIMAL(15,2),
  winning_bid_amount DECIMAL(15,2),
  
  -- Performance metrics
  time_to_application_hours DECIMAL(8,2),
  preparation_hours DECIMAL(8,2),
  win_probability_score DECIMAL(5,2),
  
  -- Notes and feedback
  outcome_notes TEXT,
  lessons_learned TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard preferences and customization
CREATE TABLE IF NOT EXISTS dashboard_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Widget preferences
  enabled_widgets TEXT[] DEFAULT ARRAY['stats', 'roi', 'timeline', 'performance', 'alerts'],
  widget_order INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5],
  
  -- Display preferences
  default_time_period VARCHAR(20) DEFAULT 'monthly', -- daily, weekly, monthly, yearly
  show_financial_metrics BOOLEAN DEFAULT true,
  show_performance_charts BOOLEAN DEFAULT true,
  show_competitor_analysis BOOLEAN DEFAULT false,
  
  -- Notification preferences for dashboard
  alert_on_new_opportunities BOOLEAN DEFAULT true,
  alert_on_deadlines BOOLEAN DEFAULT true,
  alert_on_won_contracts BOOLEAN DEFAULT true,
  deadline_warning_days INTEGER[] DEFAULT ARRAY[7, 3, 1],
  
  -- ROI calculation preferences
  hourly_rate DECIMAL(8,2) DEFAULT 75.00, -- For time savings calculations
  manual_search_hours_per_opportunity DECIMAL(4,2) DEFAULT 2.5,
  include_indirect_benefits BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market intelligence data
CREATE TABLE IF NOT EXISTS market_intelligence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Market segment
  industry VARCHAR(100),
  province VARCHAR(3),
  procurement_method VARCHAR(50),
  
  -- Time period
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Market metrics
  total_opportunities INTEGER DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0,
  average_opportunity_value DECIMAL(15,2) DEFAULT 0,
  median_opportunity_value DECIMAL(15,2) DEFAULT 0,
  
  -- Competition metrics
  average_competitors DECIMAL(4,2) DEFAULT 0,
  average_bid_spread_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Timing metrics
  average_procurement_cycle_days INTEGER DEFAULT 0,
  average_decision_time_days INTEGER DEFAULT 0,
  
  -- Trend data
  growth_rate_percentage DECIMAL(5,2) DEFAULT 0,
  opportunity_count_trend INTEGER DEFAULT 0, -- +/- from previous period
  value_trend_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(industry, province, procurement_method, period_start, period_end)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_period ON user_analytics(user_id, period_start DESC, period_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_timestamp ON user_activity_log(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action_timestamp ON user_activity_log(action_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tender_performance_user_status ON tender_performance(user_id, status, outcome_date DESC);
CREATE INDEX IF NOT EXISTS idx_tender_performance_closing_date ON tender_performance(closing_date) WHERE status = 'in_progress';
CREATE INDEX IF NOT EXISTS idx_market_intelligence_industry_period ON market_intelligence(industry, period_start DESC);

-- Functions for analytics calculations

-- Function to calculate user ROI
CREATE OR REPLACE FUNCTION calculate_user_roi(
    target_user_id UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (
    total_investment DECIMAL(10,2),
    total_return DECIMAL(15,2),
    roi_percentage DECIMAL(8,2),
    time_saved_hours DECIMAL(8,2),
    time_saved_value DECIMAL(10,2),
    contracts_won INTEGER,
    contracts_won_value DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH user_subscription AS (
        SELECT 
            COALESCE(SUM(ua.subscription_cost), 0) as investment,
            COALESCE(SUM(ua.estimated_time_saved_hours), 0) as time_saved,
            COALESCE(AVG(dp.hourly_rate), 75.00) as hourly_rate
        FROM user_analytics ua
        LEFT JOIN dashboard_preferences dp ON ua.user_id = dp.user_id
        WHERE ua.user_id = target_user_id
        AND ua.period_start >= start_date
        AND ua.period_end <= end_date
    ),
    user_performance AS (
        SELECT 
            COUNT(*) FILTER (WHERE tp.status = 'won') as won_count,
            COALESCE(SUM(tp.final_contract_value) FILTER (WHERE tp.status = 'won'), 0) as won_value
        FROM tender_performance tp
        WHERE tp.user_id = target_user_id
        AND tp.outcome_date BETWEEN start_date AND end_date
    )
    SELECT 
        us.investment,
        (up.won_value + (us.time_saved * us.hourly_rate)) as total_return,
        CASE 
            WHEN us.investment > 0 THEN 
                ((up.won_value + (us.time_saved * us.hourly_rate) - us.investment) / us.investment * 100)
            ELSE 0 
        END as roi_percentage,
        us.time_saved,
        (us.time_saved * us.hourly_rate) as time_saved_value,
        up.won_count::INTEGER,
        up.won_value
    FROM user_subscription us, user_performance up;
END;
$$ LANGUAGE plpgsql;

-- Function to get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary(
    target_user_id UUID,
    time_period VARCHAR(20) DEFAULT 'monthly'
) RETURNS TABLE (
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
    period_start TIMESTAMP WITH TIME ZONE;
    period_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate time period
    period_end := NOW();
    CASE time_period
        WHEN 'daily' THEN period_start := period_end - INTERVAL '1 day';
        WHEN 'weekly' THEN period_start := period_end - INTERVAL '1 week';
        WHEN 'monthly' THEN period_start := period_end - INTERVAL '1 month';
        WHEN 'yearly' THEN period_start := period_end - INTERVAL '1 year';
        ELSE period_start := period_end - INTERVAL '1 month';
    END CASE;

    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            COALESCE(SUM(ua.opportunities_viewed), 0) as total_opps,
            COALESCE(SUM(ua.opportunities_bookmarked), 0) as bookmarked_opps,
            COALESCE(SUM(ua.opportunities_applied), 0) as applied_opps,
            COALESCE(SUM(ua.opportunities_won), 0) as won_opps,
            COALESCE(SUM(ua.total_opportunity_value), 0) as total_val,
            COALESCE(AVG(ua.response_time_hours), 0) as avg_response,
            COALESCE(AVG(ua.estimated_roi_percentage), 0) as avg_roi
        FROM user_analytics ua
        WHERE ua.user_id = target_user_id
        AND ua.period_start >= period_start
    ),
    today_stats AS (
        SELECT COUNT(*) as new_today_count
        FROM user_activity_log ual
        WHERE ual.user_id = target_user_id
        AND ual.action_type = 'view_tender'
        AND ual.timestamp >= CURRENT_DATE
    ),
    expiring_stats AS (
        SELECT COUNT(*) as expiring_count
        FROM tender_performance tp
        WHERE tp.user_id = target_user_id
        AND tp.status = 'in_progress'
        AND tp.closing_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
    )
    SELECT 
        us.total_opps::INTEGER,
        ts.new_today_count::INTEGER,
        es.expiring_count::INTEGER,
        us.bookmarked_opps::INTEGER,
        us.applied_opps::INTEGER,
        us.won_opps::INTEGER,
        us.total_val,
        CASE 
            WHEN (us.applied_opps + us.won_opps) > 0 THEN 
                (us.won_opps::DECIMAL / (us.applied_opps + us.won_opps) * 100)
            ELSE 0 
        END as win_rate,
        us.avg_response,
        us.avg_roi
    FROM user_stats us, today_stats ts, expiring_stats es;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update analytics when activity occurs
CREATE OR REPLACE FUNCTION update_user_analytics_on_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update daily analytics for the user
    INSERT INTO user_analytics (
        user_id, 
        period_start, 
        period_end, 
        period_type,
        opportunities_viewed,
        opportunities_bookmarked,
        searches_performed,
        ai_summaries_generated
    ) VALUES (
        NEW.user_id,
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '1 day',
        'daily',
        CASE WHEN NEW.action_type = 'view_tender' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_type = 'bookmark' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_type = 'search' THEN 1 ELSE 0 END,
        CASE WHEN NEW.action_type = 'ai_summary' THEN 1 ELSE 0 END
    )
    ON CONFLICT (user_id, period_start, period_end, period_type)
    DO UPDATE SET
        opportunities_viewed = user_analytics.opportunities_viewed + 
            (CASE WHEN NEW.action_type = 'view_tender' THEN 1 ELSE 0 END),
        opportunities_bookmarked = user_analytics.opportunities_bookmarked + 
            (CASE WHEN NEW.action_type = 'bookmark' THEN 1 ELSE 0 END),
        searches_performed = user_analytics.searches_performed + 
            (CASE WHEN NEW.action_type = 'search' THEN 1 ELSE 0 END),
        ai_summaries_generated = user_analytics.ai_summaries_generated + 
            (CASE WHEN NEW.action_type = 'ai_summary' THEN 1 ELSE 0 END),
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics_on_activity
    AFTER INSERT ON user_activity_log
    FOR EACH ROW
    EXECUTE FUNCTION update_user_analytics_on_activity();

-- Insert default dashboard preferences for existing users
INSERT INTO dashboard_preferences (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM dashboard_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE user_analytics IS 'Aggregated user analytics by time period for dashboard metrics';
COMMENT ON TABLE user_activity_log IS 'Detailed user activity tracking for behavior analysis';
COMMENT ON TABLE tender_performance IS 'Tender engagement and outcome tracking for ROI calculations';
COMMENT ON TABLE dashboard_preferences IS 'User customization preferences for dashboard display';
COMMENT ON TABLE market_intelligence IS 'Market trends and intelligence data for competitive analysis';

COMMENT ON FUNCTION calculate_user_roi IS 'Calculate comprehensive ROI for a user over a time period';
COMMENT ON FUNCTION get_dashboard_summary IS 'Get key dashboard metrics for a user';