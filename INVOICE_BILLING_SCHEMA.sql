-- ========================================
-- CoreGuard UK - Invoice Billing System Schema
-- ========================================
-- This SQL creates the invoice-based billing system

-- ========================================
-- UPDATE SUBSCRIPTIONS TABLE FOR BILLING
-- ========================================
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS billing_type VARCHAR(20) DEFAULT 'invoice' CHECK (billing_type IN ('invoice', 'stripe')),
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended'));

-- Update existing subscriptions to have proper billing setup
UPDATE subscriptions 
SET 
  billing_type = 'invoice',
  next_billing_date = NOW() + INTERVAL '1 month',
  status = 'active'
WHERE billing_type IS NULL OR status IS NULL;

-- ========================================
-- INVOICES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_invoices_organisation_id ON invoices(organisation_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_plan ON invoices(plan);
CREATE INDEX IF NOT EXISTS idx_invoices_reference ON invoices(reference_number);

-- ========================================
-- TRIGGER FOR UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INVOICE REFERENCE NUMBER GENERATOR
-- ========================================
CREATE OR REPLACE FUNCTION generate_invoice_reference()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate reference like: CG-2024-0001
    NEW.reference_number = 'CG-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('invoice_seq')::text, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence for invoice numbers
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- ========================================
-- TRIGGER FOR REFERENCE GENERATION
-- ========================================
CREATE TRIGGER generate_invoice_reference_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_reference();

-- ========================================
-- DEFAULT SUBSCRIPTIONS FOR EXISTING ORGS
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
-- SAMPLE INVOICE DATA (for testing)
-- ========================================
-- This would be created programmatically, but here's an example
-- INSERT INTO invoices (organisation_id, amount, plan, due_date, notes)
-- VALUES (
--     (SELECT id FROM organisations LIMIT 1),
--     30.00,
--     'pro',
--     NOW() + INTERVAL '7 days',
--     'Pro plan monthly subscription'
-- );

-- ========================================
-- VIEWS FOR BILLING DASHBOARD
-- ========================================
CREATE OR REPLACE VIEW billing_overview AS
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
-- RLS POLICIES
-- ========================================
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Organisations can see their own invoices
CREATE POLICY "Organisations can view own invoices" ON invoices
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM users WHERE organisation_id = invoices.organisation_id
        )
    );

-- Admins can do everything
CREATE POLICY "Admins full access to invoices" ON invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'admin'
            AND organisation_id = invoices.organisation_id
        )
    );
