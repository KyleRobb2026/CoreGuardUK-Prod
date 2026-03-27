-- ========================================
-- CoreGuard UK - Subscription System Schema
-- ========================================
-- This SQL creates the subscription system for feature locking

-- ========================================
-- SUBSCRIPTIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'core' CHECK (plan IN ('core', 'pro', 'custom')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'trial')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure each organisation has exactly one active subscription
    UNIQUE(organisation_id, status) WHERE status = 'active'
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_organisation_id ON subscriptions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ========================================
-- TRIGGER FOR UPDATED_AT
-- ========================================
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- RLS POLICIES
-- ========================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organisations can view their own subscriptions" ON subscriptions
    FOR ALL USING (organisation_id IN (
        SELECT organisation_id FROM users WHERE id = auth.uid()
    ));

-- ========================================
-- CREATE DEFAULT SUBSCRIPTIONS FOR EXISTING ORGANISATIONS
-- ========================================
INSERT INTO subscriptions (organisation_id, plan, status)
SELECT 
    id,
    'core',
    'active'
FROM organisations o
WHERE NOT EXISTS (
    SELECT 1 FROM subscriptions s 
    WHERE s.organisation_id = o.id AND s.status = 'active'
);

-- ========================================
-- VERIFICATION
-- ========================================
SELECT 
    'subscriptions' as table_name,
    COUNT(*) as total_subscriptions,
    COUNT(CASE WHEN plan = 'core' THEN 1 END) as core_plans,
    COUNT(CASE WHEN plan = 'pro' THEN 1 END) as pro_plans,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions
FROM subscriptions;
