-- ========================================
-- CoreGuard UK - Onboarding Migration Script
-- ========================================
-- This script updates the existing database to support the new onboarding system
-- Run this script in your Supabase SQL Editor

-- ========================================
-- 1. ADD ORGANISATION_CODE COLUMN
-- ========================================
ALTER TABLE organisations 
ADD COLUMN IF NOT EXISTS organisation_code VARCHAR(12) UNIQUE;

-- Generate unique codes for existing organisations
UPDATE organisations 
SET organisation_code = (
  SELECT UPPER(SUBSTRING(MD5(id::text), 1, 8))
  FROM generate_series(1, 1) 
  WHERE id = organisations.id
) 
WHERE organisation_code IS NULL;

-- ========================================
-- 2. UPDATE USERS TABLE FOR BETTER AUTH INTEGRATION
-- ========================================
-- Add new columns for Better Auth compatibility
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Update existing users to have role based on actor_type
UPDATE users 
SET role = CASE 
  WHEN actor_type = 'admin' THEN 'admin' 
  ELSE 'user' 
END,
name = COALESCE(first_name || ' ' || last_name, 'Unknown User')
WHERE role IS NULL OR name IS NULL;

-- Add unique constraint for email within organisation
ALTER TABLE users 
ADD CONSTRAINT users_organisation_email_unique 
UNIQUE(organisation_id, email);

-- ========================================
-- 3. CREATE ALLOWED_USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS allowed_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    invited_by UUID REFERENCES users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique email within organisation
    UNIQUE(organisation_id, email)
);

-- ========================================
-- 4. CREATE ORGANISATION_ONBOARDING TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS organisation_onboarding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    step_completed VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_by UUID REFERENCES users(id),
    
    UNIQUE(organisation_id, step_completed)
);

-- ========================================
-- 5. UPDATE SITES TABLE
-- ========================================
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- ========================================
-- 6. UPDATE PERSONNEL TABLE
-- ========================================
ALTER TABLE personnel 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
ADD COLUMN IF NOT EXISTS licence_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS licence_expiry DATE;

-- ========================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_organisation_id ON users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_allowed_users_organisation_id ON allowed_users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_allowed_users_email ON allowed_users(email);
CREATE INDEX IF NOT EXISTS idx_organisations_code ON organisations(organisation_code);
CREATE INDEX IF NOT EXISTS idx_sites_organisation_id ON sites(organisation_id);
CREATE INDEX IF NOT EXISTS idx_personnel_organisation_id ON personnel(organisation_id);

-- ========================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ========================================
-- Enable RLS on new tables if not already enabled
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE allowed_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_onboarding ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 9. UPDATE RLS POLICIES
-- ========================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Organisations can view their own data" ON organisations;
DROP POLICY IF EXISTS "Users can view their own organisation's users" ON users;
DROP POLICY IF EXISTS "Users can view their own organisation's sites" ON sites;
DROP POLICY IF EXISTS "Users can view their own organisation's personnel" ON personnel;

-- Create new RLS policies
CREATE POLICY "Organisations can view their own data" ON organisations
    FOR ALL USING (auth.uid() IS NULL OR id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view their own organisation's users" ON users
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view their own organisation's allowed users" ON allowed_users
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view their own organisation's sites" ON sites
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view their own organisation's personnel" ON personnel
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view their own organisation's onboarding" ON organisation_onboarding
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- ========================================
-- 10. CREATE UPDATED_AT TRIGGER FUNCTION
-- ========================================
-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on all relevant tables
DROP TRIGGER IF EXISTS update_organisations_updated_at ON organisations;
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sites_updated_at ON sites;
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_personnel_updated_at ON personnel;
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 11. MIGRATE EXISTING DATA
-- ========================================
-- Add existing admins to allowed_users table
INSERT INTO allowed_users (email, organisation_id, role, invited_by)
SELECT 
    u.email, 
    u.organisation_id, 
    u.role,
    u.id
FROM users u
WHERE u.role = 'admin'
AND NOT EXISTS (
    SELECT 1 FROM allowed_users au 
    WHERE au.email = u.email AND au.organisation_id = u.organisation_id
);

-- ========================================
-- 12. VERIFICATION
-- ========================================
-- Check if migration was successful
SELECT 
    'organisations' as table_name, 
    COUNT(*) as record_count,
    COUNT(CASE WHEN organisation_code IS NOT NULL THEN 1 END) as with_code
FROM organisations
UNION ALL
SELECT 
    'users' as table_name, 
    COUNT(*) as record_count,
    COUNT(CASE WHEN role IS NOT NULL THEN 1 END) as with_role
FROM users
UNION ALL
SELECT 
    'allowed_users' as table_name, 
    COUNT(*) as record_count,
    COUNT(*) as with_role
FROM allowed_users
UNION ALL
SELECT 
    'organisation_onboarding' as table_name, 
    COUNT(*) as record_count,
    COUNT(*) as with_step
FROM organisation_onboarding;

-- Migration complete!
SELECT 'CoreGuard UK Onboarding Migration completed successfully!' as status;
