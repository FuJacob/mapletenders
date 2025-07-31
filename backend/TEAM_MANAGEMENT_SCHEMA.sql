-- ============================================
-- TEAM MANAGEMENT SCHEMA FOR SUPABASE
-- ============================================
-- Apply this SQL in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    size VARCHAR(20) DEFAULT 'small' CHECK (size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT organizations_name_check CHECK (length(name) >= 1),
    CONSTRAINT organizations_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

-- ============================================
-- ORGANIZATION MEMBERS TABLE  
-- ============================================
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID REFERENCES auth.users(id),
    
    -- Ensure one membership per user per organization
    UNIQUE(organization_id, user_id)
);

-- ============================================
-- TEAM INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer')),
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    personal_message TEXT,
    
    -- Prevent duplicate invitations
    UNIQUE(organization_id, email)
);

-- ============================================
-- SHARED BOOKMARKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS shared_bookmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
    title VARCHAR(500),
    notes TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'watching', 'applied', 'won', 'lost', 'archived')),
    assigned_to UUID REFERENCES auth.users(id),
    tags TEXT[] DEFAULT '{}',
    application_deadline TIMESTAMP WITH TIME ZONE,
    estimated_bid_amount DECIMAL(12,2),
    win_probability INTEGER CHECK (win_probability >= 0 AND win_probability <= 100),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TEAM SAVED SEARCHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_saved_searches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    search_query JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    enable_alerts BOOLEAN DEFAULT false,
    alert_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (alert_frequency IN ('daily', 'weekly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);

CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(role);

CREATE INDEX IF NOT EXISTS idx_team_invitations_org_id ON team_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_expires_at ON team_invitations(expires_at);

CREATE INDEX IF NOT EXISTS idx_shared_bookmarks_org_id ON shared_bookmarks(organization_id);
CREATE INDEX IF NOT EXISTS idx_shared_bookmarks_tender_id ON shared_bookmarks(tender_id);
CREATE INDEX IF NOT EXISTS idx_shared_bookmarks_assigned_to ON shared_bookmarks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_shared_bookmarks_status ON shared_bookmarks(status);
CREATE INDEX IF NOT EXISTS idx_shared_bookmarks_priority ON shared_bookmarks(priority);

CREATE INDEX IF NOT EXISTS idx_team_saved_searches_org_id ON team_saved_searches(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_saved_searches_created_by ON team_saved_searches(created_by);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_saved_searches ENABLE ROW LEVEL SECURITY;

-- Organizations policies
CREATE POLICY "Users can view organizations they are members of" ON organizations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = organizations.id 
            AND organization_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Organization owners/admins can update organization" ON organizations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = organizations.id 
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin')
        )
    );

-- Organization members policies
CREATE POLICY "Users can view members of organizations they belong to" ON organization_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM organization_members om2
            WHERE om2.organization_id = organization_members.organization_id 
            AND om2.user_id = auth.uid()
        )
    );

CREATE POLICY "Organization admins can manage members" ON organization_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = organization_members.organization_id 
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin')
        )
    );

-- Team invitations policies
CREATE POLICY "Organization admins can manage invitations" ON team_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = team_invitations.organization_id 
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin')
        )
    );

-- Shared bookmarks policies
CREATE POLICY "Organization members can view shared bookmarks" ON shared_bookmarks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = shared_bookmarks.organization_id 
            AND organization_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Organization members can create shared bookmarks" ON shared_bookmarks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = shared_bookmarks.organization_id 
            AND organization_members.user_id = auth.uid()
        ) AND auth.uid() = created_by
    );

CREATE POLICY "Organization members can update shared bookmarks" ON shared_bookmarks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = shared_bookmarks.organization_id 
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin', 'manager')
        ) OR created_by = auth.uid()
    );

-- Team saved searches policies
CREATE POLICY "Organization members can view team saved searches" ON team_saved_searches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = team_saved_searches.organization_id 
            AND organization_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Organization members can create team saved searches" ON team_saved_searches
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = team_saved_searches.organization_id 
            AND organization_members.user_id = auth.uid()
        ) AND auth.uid() = created_by
    );

CREATE POLICY "Creators and managers can update team saved searches" ON team_saved_searches
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM organization_members 
            WHERE organization_members.organization_id = team_saved_searches.organization_id 
            AND organization_members.user_id = auth.uid()
            AND organization_members.role IN ('owner', 'admin', 'manager')
        ) OR created_by = auth.uid()
    );

-- ============================================
-- STORED FUNCTIONS
-- ============================================

-- Function to create organization with owner membership
CREATE OR REPLACE FUNCTION create_organization(
    p_name VARCHAR(255),
    p_slug VARCHAR(100),
    p_description TEXT DEFAULT NULL,
    p_industry VARCHAR(100) DEFAULT NULL,
    p_size VARCHAR(20) DEFAULT 'small'
) RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Insert organization
    INSERT INTO organizations (name, slug, description, industry, size, created_by)
    VALUES (p_name, p_slug, p_description, p_industry, p_size, auth.uid())
    RETURNING id INTO org_id;
    
    -- Add creator as owner
    INSERT INTO organization_members (organization_id, user_id, role)
    VALUES (org_id, auth.uid(), 'owner');
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user organizations with role and member count
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    slug VARCHAR(100),
    description TEXT,
    industry VARCHAR(100),
    size VARCHAR(20),
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    role VARCHAR(20),
    member_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.name,
        o.slug,
        o.description,
        o.industry,
        o.size,
        o.logo_url,
        o.website_url,
        o.created_at,
        o.updated_at,
        om.role,
        (SELECT COUNT(*) FROM organization_members om2 WHERE om2.organization_id = o.id) as member_count
    FROM organizations o
    JOIN organization_members om ON o.id = om.organization_id
    WHERE om.user_id = auth.uid()
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shared_bookmarks_updated_at 
    BEFORE UPDATE ON shared_bookmarks 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_team_saved_searches_updated_at 
    BEFORE UPDATE ON team_saved_searches 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================

/*
-- Uncomment to insert sample data for testing
INSERT INTO organizations (name, slug, description, industry, size, created_by) 
VALUES ('Acme Corp', 'acme-corp', 'Leading technology company', 'Technology', 'medium', auth.uid());

INSERT INTO organization_members (organization_id, user_id, role)
SELECT o.id, auth.uid(), 'owner' 
FROM organizations o 
WHERE o.slug = 'acme-corp';
*/