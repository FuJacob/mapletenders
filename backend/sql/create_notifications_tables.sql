-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT FALSE,
    channels TEXT[] DEFAULT '{}',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification')),
    channels TEXT[] DEFAULT '{}',
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('instant', 'daily', 'weekly')),
    enabled BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, type)
);

-- Create deadline_alerts table
CREATE TABLE IF NOT EXISTS deadline_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tender_id VARCHAR(255) NOT NULL,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('closing_soon', 'closing_today', 'closing_overdue')),
    closing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    alert_date TIMESTAMP WITH TIME ZONE NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    channels TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification_channels table for configuration
CREATE TABLE IF NOT EXISTS notification_channels (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'slack', 'teams', 'in_app')),
    enabled BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_notification_channels for user-specific channel settings
CREATE TABLE IF NOT EXISTS user_notification_channels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel_id VARCHAR(50) NOT NULL REFERENCES notification_channels(id),
    enabled BOOLEAN DEFAULT TRUE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, channel_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_for ON notifications(scheduled_for);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_type ON notification_preferences(type);

CREATE INDEX IF NOT EXISTS idx_deadline_alerts_user_id ON deadline_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_deadline_alerts_tender_id ON deadline_alerts(tender_id);
CREATE INDEX IF NOT EXISTS idx_deadline_alerts_closing_date ON deadline_alerts(closing_date);
CREATE INDEX IF NOT EXISTS idx_deadline_alerts_sent ON deadline_alerts(sent);

CREATE INDEX IF NOT EXISTS idx_user_notification_channels_user_id ON user_notification_channels(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_preferences_updated_at();

CREATE OR REPLACE FUNCTION update_user_notification_channels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_notification_channels_updated_at ON user_notification_channels;
CREATE TRIGGER user_notification_channels_updated_at
    BEFORE UPDATE ON user_notification_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_user_notification_channels_updated_at();

-- Insert default notification channels
INSERT INTO notification_channels (id, name, type, enabled) VALUES
    ('email', 'Email', 'email', true),
    ('sms', 'SMS', 'sms', true),
    ('slack', 'Slack', 'slack', true),
    ('teams', 'Microsoft Teams', 'teams', true),
    ('in_app', 'In-App Notifications', 'in_app', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default notification preferences for all users (run this after user creation)
-- This would typically be done in the user registration process
/*
INSERT INTO notification_preferences (user_id, type, channels, frequency, enabled)
SELECT 
    u.id as user_id,
    unnest(ARRAY['deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification']) as type,
    CASE 
        WHEN unnest(ARRAY['deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification']) = 'deadline_alert' 
        THEN ARRAY['email', 'in_app']
        WHEN unnest(ARRAY['deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification']) = 'system_notification' 
        THEN ARRAY['in_app']
        ELSE ARRAY['email', 'in_app']
    END as channels,
    CASE 
        WHEN unnest(ARRAY['deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification']) = 'deadline_alert' 
        THEN 'instant'
        WHEN unnest(ARRAY['deadline_alert', 'new_tender', 'saved_search_alert', 'system_notification']) = 'new_tender' 
        THEN 'daily'
        ELSE 'instant'
    END as frequency,
    true as enabled
FROM users u
ON CONFLICT (user_id, type) DO NOTHING;
*/