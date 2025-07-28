-- Create calendar_connections table
CREATE TABLE IF NOT EXISTS calendar_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('google', 'outlook', 'apple')),
    account_email VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    calendar_id VARCHAR(255),
    calendar_name VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    sync_settings JSONB DEFAULT '{
        "syncDeadlines": true,
        "syncBookmarked": true,
        "syncSavedSearches": false,
        "reminderMinutes": [60, 1440],
        "eventPrefix": "[Tender] "
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tender_id VARCHAR(255) NOT NULL,
    calendar_connection_id UUID NOT NULL REFERENCES calendar_connections(id) ON DELETE CASCADE,
    external_event_id VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(500),
    url TEXT,
    reminders INTEGER[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'synced', 'failed')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(calendar_connection_id, tender_id)
);

-- Create calendar_sync_log table for tracking sync operations
CREATE TABLE IF NOT EXISTS calendar_sync_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL,
    last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_status VARCHAR(20) NOT NULL CHECK (sync_status IN ('success', 'error', 'partial')),
    events_created INTEGER DEFAULT 0,
    events_updated INTEGER DEFAULT 0,
    events_deleted INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calendar_connections_user_id ON calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_provider ON calendar_connections(provider);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_enabled ON calendar_connections(enabled);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_tender_id ON calendar_events(tender_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_connection_id ON calendar_events(calendar_connection_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);

CREATE INDEX IF NOT EXISTS idx_calendar_sync_log_user_id ON calendar_sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_log_provider ON calendar_sync_log(provider);
CREATE INDEX IF NOT EXISTS idx_calendar_sync_log_sync_at ON calendar_sync_log(last_sync_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calendar_connections_updated_at ON calendar_connections;
CREATE TRIGGER calendar_connections_updated_at
    BEFORE UPDATE ON calendar_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_calendar_connections_updated_at();

-- Create function to clean up old sync logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_calendar_sync_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM calendar_sync_log 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's calendar sync status
CREATE OR REPLACE FUNCTION get_user_calendar_sync_status(p_user_id UUID)
RETURNS TABLE (
    provider VARCHAR(20),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20),
    total_events INTEGER,
    enabled_connections INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cc.provider,
        csl.last_sync_at,
        csl.sync_status,
        COUNT(ce.id)::INTEGER as total_events,
        COUNT(CASE WHEN cc.enabled THEN 1 END)::INTEGER as enabled_connections
    FROM calendar_connections cc
    LEFT JOIN calendar_sync_log csl ON csl.user_id = cc.user_id AND csl.provider = cc.provider
    LEFT JOIN calendar_events ce ON ce.calendar_connection_id = cc.id
    WHERE cc.user_id = p_user_id
    GROUP BY cc.provider, csl.last_sync_at, csl.sync_status
    ORDER BY csl.last_sync_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Create function to get upcoming calendar events for a user
CREATE OR REPLACE FUNCTION get_upcoming_calendar_events(p_user_id UUID, p_days_ahead INTEGER DEFAULT 7)
RETURNS TABLE (
    event_id UUID,
    tender_id VARCHAR(255),
    title VARCHAR(500),
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    provider VARCHAR(20),
    sync_status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.id as event_id,
        ce.tender_id,
        ce.title,
        ce.description,
        ce.start_time,
        ce.end_time,
        cc.provider,
        ce.status as sync_status
    FROM calendar_events ce
    JOIN calendar_connections cc ON cc.id = ce.calendar_connection_id
    WHERE ce.user_id = p_user_id
    AND ce.start_time >= NOW()
    AND ce.start_time <= NOW() + (p_days_ahead || ' days')::INTERVAL
    AND cc.enabled = true
    ORDER BY ce.start_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample calendar provider settings (optional)
-- These could be used to store global provider configurations
CREATE TABLE IF NOT EXISTS calendar_provider_settings (
    provider VARCHAR(20) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    features JSONB DEFAULT '[]',
    oauth_settings JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO calendar_provider_settings (provider, display_name, description, features, enabled) VALUES
    ('google', 'Google Calendar', 'Sync with your Google Calendar', 
     '["Two-way sync", "Smart reminders", "Multiple calendars"]', true),
    ('outlook', 'Microsoft Outlook', 'Sync with Outlook/Office 365', 
     '["Two-way sync", "Teams integration", "Exchange support"]', false),
    ('apple', 'Apple Calendar', 'Sync with iCloud Calendar', 
     '["Two-way sync", "iOS integration", "macOS support"]', false)
ON CONFLICT (provider) DO NOTHING;