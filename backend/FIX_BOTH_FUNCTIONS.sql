-- COMPLETE FIX: Replace both functions with these corrected versions
-- Run this in Supabase SQL Editor to fix all ambiguous column reference errors

-- First fix the calculate_user_roi function
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
  calc_total_investment DECIMAL(15,2);
  calc_total_return DECIMAL(15,2);
  calc_roi_percentage DECIMAL(8,2);
  calc_time_saved_hours DECIMAL(8,2);
  calc_time_saved_value DECIMAL(15,2);
  calc_contracts_won INTEGER;
  calc_contracts_won_value DECIMAL(15,2);
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
    COALESCE(SUM(ua.opportunities_viewed), 0) as total_viewed,
    COALESCE(SUM(ua.opportunities_bookmarked), 0) as total_bookmarked,
    COALESCE(SUM(ua.opportunities_applied), 0) as total_applied,
    COALESCE(SUM(ua.opportunities_won), 0) as total_won,
    COALESCE(SUM(ua.contracts_won_value), 0) as total_contracts_value,
    COALESCE(SUM(ua.estimated_time_saved_hours), 0) as total_time_saved,
    COALESCE(SUM(ua.subscription_cost), 0) as total_subscription_cost
  INTO analytics_data
  FROM user_analytics ua
  WHERE ua.user_id = target_user_id 
    AND ua.period_start >= start_date 
    AND ua.period_end <= end_date;
    
  -- Calculate ROI components
  calc_total_investment := COALESCE(analytics_data.total_subscription_cost, subscription_cost);
  calc_contracts_won := analytics_data.total_won;
  calc_contracts_won_value := analytics_data.total_contracts_value;
  
  -- Calculate time savings
  calc_time_saved_hours := GREATEST(
    analytics_data.total_time_saved,
    analytics_data.total_viewed * user_prefs.manual_search_hours_per_opportunity
  );
  
  calc_time_saved_value := calc_time_saved_hours * user_prefs.hourly_rate;
  
  -- Total return includes contract value + time savings value
  calc_total_return := calc_contracts_won_value;
  IF user_prefs.include_indirect_benefits THEN
    calc_total_return := calc_total_return + calc_time_saved_value;
  END IF;
  
  -- Calculate ROI percentage
  IF calc_total_investment > 0 THEN
    calc_roi_percentage := ((calc_total_return - calc_total_investment) / calc_total_investment) * 100;
  ELSE
    calc_roi_percentage := 0;
  END IF;
  
  -- Return the calculated values
  total_investment := calc_total_investment;
  total_return := calc_total_return;
  roi_percentage := calc_roi_percentage;
  time_saved_hours := calc_time_saved_hours;
  time_saved_value := calc_time_saved_value;
  contracts_won := calc_contracts_won;
  contracts_won_value := calc_contracts_won_value;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now fix the get_dashboard_summary function
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
  roi_result DECIMAL(8,2);
  calc_total_opportunities INTEGER;
  calc_new_today INTEGER;
  calc_expiring_soon INTEGER;
  calc_bookmarked INTEGER;
  calc_applied INTEGER;
  calc_won INTEGER;
  calc_total_value DECIMAL(15,2);
  calc_win_rate DECIMAL(5,2);
  calc_avg_response_time DECIMAL(8,2);
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
  
  -- Get ROI from the calculation function first
  SELECT calc_roi.roi_percentage 
  INTO roi_result
  FROM calculate_user_roi(target_user_id, period_start_calc, period_end_calc) AS calc_roi
  LIMIT 1;
  
  -- Get opportunity counts
  SELECT COUNT(*) INTO calc_total_opportunities FROM tenders;
  
  SELECT COUNT(*) INTO calc_new_today
  FROM tenders 
  WHERE published_date >= CURRENT_DATE - INTERVAL '1 day';
  
  SELECT COUNT(*) INTO calc_expiring_soon
  FROM tenders 
  WHERE closing_date BETWEEN NOW() AND NOW() + INTERVAL '7 days';
  
  SELECT COUNT(*) INTO calc_bookmarked
  FROM bookmarks 
  WHERE user_id = target_user_id AND status = 'active';
  
  SELECT COUNT(*) INTO calc_applied
  FROM tender_performance 
  WHERE user_id = target_user_id AND status = 'applied';
  
  SELECT COUNT(*) INTO calc_won
  FROM tender_performance 
  WHERE user_id = target_user_id AND status = 'won';
  
  -- Get financial metrics
  SELECT COALESCE(SUM(final_contract_value), 0) INTO calc_total_value
  FROM tender_performance 
  WHERE user_id = target_user_id AND status = 'won';
  
  -- Calculate win rate
  SELECT 
    CASE 
      WHEN COUNT(*) FILTER (WHERE status IN ('applied', 'won', 'lost')) > 0
      THEN (COUNT(*) FILTER (WHERE status = 'won') * 100.0 / 
            COUNT(*) FILTER (WHERE status IN ('applied', 'won', 'lost')))
      ELSE 0
    END INTO calc_win_rate
  FROM tender_performance 
  WHERE user_id = target_user_id;
  
  -- Calculate average response time
  SELECT COALESCE(AVG(time_to_application_hours), 0) INTO calc_avg_response_time
  FROM tender_performance 
  WHERE user_id = target_user_id AND time_to_application_hours IS NOT NULL;
  
  -- Set return values
  total_opportunities := calc_total_opportunities;
  new_today := calc_new_today;
  expiring_soon := calc_expiring_soon;
  bookmarked := calc_bookmarked;
  applied := calc_applied;
  won := calc_won;
  total_value := calc_total_value;
  win_rate := calc_win_rate;
  avg_response_time := calc_avg_response_time;
  roi_percentage := COALESCE(roi_result, 0);
    
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;