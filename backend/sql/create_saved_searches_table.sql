-- Create saved_searches table for advanced search functionality
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    is_alert BOOLEAN DEFAULT FALSE,
    alert_frequency VARCHAR(20) CHECK (alert_frequency IN ('instant', 'daily', 'weekly')),
    tags TEXT[] DEFAULT '{}',
    favorite BOOLEAN DEFAULT FALSE,
    result_count INTEGER DEFAULT 0,
    last_run TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search_performance table for tracking search analytics
CREATE TABLE IF NOT EXISTS search_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    search_id VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    result_count INTEGER NOT NULL DEFAULT 0,
    search_time_ms INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_saved_searches_updated_at ON saved_searches(updated_at);
CREATE INDEX IF NOT EXISTS idx_saved_searches_is_alert ON saved_searches(is_alert);
CREATE INDEX IF NOT EXISTS idx_saved_searches_favorite ON saved_searches(favorite);

CREATE INDEX IF NOT EXISTS idx_search_performance_user_id ON search_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_search_performance_timestamp ON search_performance(timestamp);
CREATE INDEX IF NOT EXISTS idx_search_performance_search_id ON search_performance(search_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_saved_searches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS saved_searches_updated_at ON saved_searches;
CREATE TRIGGER saved_searches_updated_at
    BEFORE UPDATE ON saved_searches
    FOR EACH ROW
    EXECUTE FUNCTION update_saved_searches_updated_at();

-- Add some sample saved searches for development (optional)
-- INSERT INTO saved_searches (user_id, name, query, filters, is_alert, tags, favorite)
-- VALUES 
--     ('user-uuid-here', 'IT Services Opportunities', 'information technology', 
--      '{"location": {"provinces": ["Ontario", "British Columbia"]}, "categories": {"industries": ["Information Technology"]}}',
--      true, ARRAY['IT', 'Technology'], true),
--     ('user-uuid-here', 'Construction Projects Over $1M', 'construction', 
--      '{"financial": {"minValue": 1000000}, "categories": {"industries": ["Construction"]}}',
--      false, ARRAY['Construction', 'High Value'], false);