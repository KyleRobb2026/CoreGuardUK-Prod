-- ========================================
-- CoreGuard UK - Complete Invoice Billing System
-- ========================================
-- This single file contains everything needed for the invoice-based billing system

-- ========================================
-- 1. EXTENSIONS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. CLEAN UP EXISTING OBJECTS
-- ========================================
-- Drop tables first (will cascade to dependent objects)
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- Drop views
DROP VIEW IF EXISTS billing_overview;

-- Drop functions (now safe since tables are gone)
DROP FUNCTION IF EXISTS generate_invoice_reference();
DROP FUNCTION IF EXISTS update_subscriptions_updated_at();
DROP FUNCTION IF EXISTS update_invoices_updated_at();

-- ========================================
-- 3. SEQUENCES
-- ========================================
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- ========================================
-- 4. SUBSCRIPTIONS TABLE
-- ========================================
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    plan VARCHAR(20) NOT NULL DEFAULT 'core' CHECK (plan IN ('core', 'pro', 'custom')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    billing_type VARCHAR(20) DEFAULT 'invoice' CHECK (billing_type IN ('invoice', 'stripe')),
    next_billing_date TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. INVOICES TABLE
-- ========================================
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('core', 'pro', 'custom')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_date TIMESTAMP WITH TIME ZONE,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. INDEXES
-- ========================================
CREATE INDEX idx_subscriptions_organisation_id ON subscriptions(organisation_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_invoices_organisation_id ON invoices(organisation_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_plan ON invoices(plan);
CREATE INDEX idx_invoices_reference ON invoices(reference_number);

-- ========================================
-- 7. PARTIAL UNIQUE INDEX FOR ACTIVE SUBSCRIPTIONS
-- ========================================
CREATE UNIQUE INDEX idx_subscriptions_active_unique 
ON subscriptions(organisation_id) 
WHERE status = 'active';

-- ========================================
-- 8. TRIGGER FUNCTIONS
-- ========================================

-- Updated at trigger for subscriptions
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated at trigger for invoices
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- 9. TRIGGERS
-- ========================================

-- Trigger for subscriptions updated_at
CREATE TRIGGER update_subscriptions_updated_at_trigger 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Trigger for invoices updated_at
CREATE TRIGGER update_invoices_updated_at_trigger 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_invoices_updated_at();

-- ========================================
-- 10. INVOICE REFERENCE NUMBER GENERATOR
-- ========================================
CREATE OR REPLACE FUNCTION generate_invoice_reference()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate reference like: CG-2024-0001
    NEW.reference_number = 'CG-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('invoice_seq')::text, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ========================================
-- 11. REFERENCE GENERATION TRIGGER
-- ========================================
CREATE TRIGGER generate_invoice_reference_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_reference();

-- ========================================
-- 12. DEFAULT SUBSCRIPTIONS FOR EXISTING ORGS
-- ========================================
INSERT INTO subscriptions (organisation_id, plan, status, billing_type, next_billing_date)
SELECT 
    id, 
    'core'::VARCHAR(20), 
    'active'::VARCHAR(20), 
    'invoice'::VARCHAR(20),
    NOW() + INTERVAL '1 month'
FROM organisations 
WHERE id NOT IN (SELECT DISTINCT organisation_id FROM subscriptions);

-- ========================================
-- 13. BILLING OVERVIEW VIEW
-- ========================================
CREATE VIEW billing_overview AS
SELECT 
    o.id as organisation_id,
    o.name as organisation_name,
    s.plan as current_plan,
    s.status as subscription_status,
    s.next_billing_date,
    i.id as latest_invoice_id,
    i.amount as latest_amount,
    i.status as invoice_status,
    i.due_date,
    i.reference_number,
    CASE 
        WHEN i.status = 'pending' THEN 'Payment pending'
        WHEN i.status = 'overdue' THEN 'Overdue - features restricted'
        WHEN i.status = 'paid' THEN 'Paid'
        ELSE 'No invoice'
    END as payment_status
FROM organisations o
LEFT JOIN subscriptions s ON o.id = s.organisation_id AND s.status = 'active'
LEFT JOIN invoices i ON o.id = i.organisation_id 
    AND i.id = (
        SELECT id FROM invoices i2 
        WHERE i2.organisation_id = o.id 
        ORDER BY issued_date DESC 
        LIMIT 1
    );

-- ========================================
-- 14. RLS POLICIES (Row Level Security)
-- ========================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Organisations can see their own subscriptions
CREATE POLICY "Organisations can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM users WHERE organisation_id = subscriptions.organisation_id
        )
    );

-- Admins can do everything with subscriptions (using actor_type)
CREATE POLICY "Admins full access to subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND actor_type = 'admin'
            AND organisation_id = subscriptions.organisation_id
        )
    );

-- Organisations can see their own invoices
CREATE POLICY "Organisations can view own invoices" ON invoices
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM users WHERE organisation_id = invoices.organisation_id
        )
    );

-- Admins can do everything with invoices (using actor_type)
CREATE POLICY "Admins full access to invoices" ON invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND actor_type = 'admin'
            AND organisation_id = invoices.organisation_id
        )
    );

-- ========================================
-- 15. SAMPLE DATA (Optional - for testing)
-- ========================================
-- Uncomment these lines to create sample data for testing

/*
-- Sample invoice for testing
INSERT INTO invoices (organisation_id, amount, plan, due_date, notes)
SELECT 
    id, 
    30.00,
    'pro',
    NOW() + INTERVAL '7 days',
    'Pro plan monthly subscription - sample data'
FROM organisations 
LIMIT 1;
*/

-- ========================================
-- 16. VERIFICATION QUERIES
-- ========================================
-- Run these queries after creation to verify everything works:

-- Check subscriptions table
-- SELECT * FROM subscriptions LIMIT 5;

-- Check invoices table  
-- SELECT * FROM invoices LIMIT 5;

-- Check billing overview view
-- SELECT * FROM billing_overview LIMIT 5;

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE tablename IN ('subscriptions', 'invoices');

-- Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('subscriptions', 'invoices');

-- Check triggers
-- SELECT trigger_name FROM information_schema.triggers WHERE event_object_table IN ('subscriptions', 'invoices');

-- Check invoice sequence
-- SELECT last_value FROM invoice_seq;

-- ========================================
-- 17. USAGE NOTES
-- ========================================
/*
This schema creates a complete invoice-based billing system:

FEATURES:
✅ Automatic invoice reference generation (CG-2024-0001 format)
✅ Subscription management with plan tracking
✅ Invoice status tracking (pending, paid, overdue, cancelled)
✅ Row Level Security for data protection
✅ Billing overview view for dashboard
✅ Default subscriptions for existing organisations
✅ Proper indexes for performance
✅ Compatible with existing CoreGuard database structure

TABLES CREATED:
- subscriptions: Tracks organisation plans and billing status
- invoices: Tracks payment invoices and due dates

VIEWS CREATED:
- billing_overview: Combined view for billing dashboard

SECURITY:
- RLS policies ensure users can only see their own data
- Admins (actor_type = 'admin') have full access
- Proper foreign key constraints prevent orphaned data

INTEGRATION:
- Works with existing organisations table
- Uses existing users table with actor_type field
- Compatible with uuid_generate_v4() from your existing schema
*/

-- ========================================
-- 18. NEXT STEPS
-- ========================================
/*
After running this schema:

1. Test the backend API endpoints:
   - POST /api/billing/upgrade
   - GET /api/billing/current
   - POST /api/billing/payments/confirm

2. Test the frontend components:
   - UpgradeButton component
   - BillingDashboard component

3. Configure environment variables:
   - DATABASE_URL (should already be set)
   - RESEND_API_KEY (for invoice emails)

4. Set up Resend for email notifications:
   - Invoice generation emails
   - Overdue warning emails

The invoice-based billing system will be fully functional!
*/
