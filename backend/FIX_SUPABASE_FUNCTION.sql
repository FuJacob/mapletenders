-- FIX: Replace the get_dashboard_summary function with this corrected version
-- Run this in Supabase SQL Editor to fix the ambiguous column reference error

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
  
  -- Get summary metrics
  SELECT 
    -- Opportunity counts
    (SELECT COUNT(*) FROM tenders)::INTEGER,
    (SELECT COUNT(*) 
     FROM tenders 
     WHERE published_date >= CURRENT_DATE - INTERVAL '1 day')::INTEGER,
    (SELECT COUNT(*) 
     FROM tenders 
     WHERE closing_date BETWEEN NOW() AND NOW() + INTERVAL '7 days')::INTEGER,
    (SELECT COUNT(*) 
     FROM bookmarks 
     WHERE user_id = target_user_id AND status = 'active')::INTEGER,
    (SELECT COUNT(*) 
     FROM tender_performance 
     WHERE user_id = target_user_id AND status = 'applied')::INTEGER,
    (SELECT COUNT(*) 
     FROM tender_performance 
     WHERE user_id = target_user_id AND status = 'won')::INTEGER,
    
    -- Financial metrics
    COALESCE((SELECT SUM(final_contract_value) 
              FROM tender_performance 
              WHERE user_id = target_user_id AND status = 'won'), 0),
    
    -- Performance metrics
    CASE 
      WHEN (SELECT COUNT(*) FROM tender_performance WHERE user_id = target_user_id AND status IN ('applied', 'won', 'lost')) > 0
      THEN (SELECT (COUNT(*) FILTER (WHERE status = 'won') * 100.0 / 
                   COUNT(*) FILTER (WHERE status IN ('applied', 'won', 'lost')))
            FROM tender_performance 
            WHERE user_id = target_user_id)
      ELSE 0
    END,
    
    COALESCE((SELECT AVG(time_to_application_hours) 
              FROM tender_performance 
              WHERE user_id = target_user_id AND time_to_application_hours IS NOT NULL), 0),
    
    -- ROI result
    COALESCE(roi_result, 0)
  
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