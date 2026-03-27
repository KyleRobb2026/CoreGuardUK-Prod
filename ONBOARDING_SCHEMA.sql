-- ========================================
-- CoreGuard UK - Onboarding System Schema
-- ========================================
-- This SQL creates the tables needed for the secure onboarding system

-- Organisations table
CREATE TABLE IF NOT EXISTS organisations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    organisation_code VARCHAR(12) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    company_number VARCHAR(50),
    vat_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (updated to enforce organisation relationship)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique email within organisation
    UNIQUE(organisation_id, email)
);

-- Allowed users table (pre-approval system)
CREATE TABLE IF NOT EXISTS allowed_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique email within organisation
    UNIQUE(organisation_id, email)
);

-- Sites table (for organisation setup)
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personnel table (for organisation setup)
CREATE TABLE IF NOT EXISTS personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(100),
    licence_number VARCHAR(100),
    licence_expiry DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organisation onboarding progress
CREATE TABLE IF NOT EXISTS organisation_onboarding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    step_completed VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_by UUID REFERENCES users(id),
    
    UNIQUE(organisation_id, step_completed)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_organisation_id ON users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_allowed_users_organisation_id ON allowed_users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_allowed_users_email ON allowed_users(email);
CREATE INDEX IF NOT EXISTS idx_organisations_code ON organisations(organisation_code);
CREATE INDEX IF NOT EXISTS idx_sites_organisation_id ON sites(organisation_id);
CREATE INDEX IF NOT EXISTS idx_personnel_organisation_id ON personnel(organisation_id);

-- RLS (Row Level Security) policies
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_onboarding ENABLE ROW LEVEL SECURITY;

-- Organisation policies
CREATE POLICY "Organisations can view their own data" ON organisations
    FOR ALL USING (auth.uid() IS NULL OR id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Users policies
CREATE POLICY "Users can view their own organisation's users" ON users
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Allowed users policies
CREATE POLICY "Users can view their own organisation's allowed users" ON allowed_users
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Sites policies
CREATE POLICY "Users can view their own organisation's sites" ON sites
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Personnel policies
CREATE POLICY "Users can view their own organisation's personnel" ON personnel
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Onboarding policies
CREATE POLICY "Users can view their own organisation's onboarding" ON organisation_onboarding
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
