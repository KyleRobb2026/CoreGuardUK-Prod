-- ========================================
-- COREGUARD SMS - NEW SCHEMA ADDITIONS (CLEAN VERSION)
-- ========================================
-- Run these additional tables/features after the main schema
-- This version uses IF NOT EXISTS to avoid conflicts

-- ========================================
-- 1. INCIDENT REPORTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    check_call_id UUID REFERENCES check_calls(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    photos TEXT[],
    witnesses TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. FORMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    form_type VARCHAR(100) NOT NULL,
    fields JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. FORM SUBMISSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
    personnel_id UUID REFERENCES personnel(id) ON DELETE SET NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    submission_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved', 'rejected')),
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    review_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. AUDIT LOGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(255),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. COMPLIANCE RECORDS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS compliance_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    compliance_type VARCHAR(100) NOT NULL,
    requirement TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'compliant' CHECK (status IN ('compliant', 'non_compliant', 'pending_review', 'exempt')),
    last_check_date DATE,
    next_check_date DATE,
    evidence_files TEXT[],
    notes TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. SETTINGS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organisation_id, key)
);

-- ========================================
-- NEW INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_incident_reports_organisation_id ON incident_reports(organisation_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_severity ON incident_reports(severity);

CREATE INDEX IF NOT EXISTS idx_form_submissions_organisation_id ON form_submissions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_organisation_id ON audit_logs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_compliance_records_organisation_id ON compliance_records(organisation_id);

CREATE INDEX IF NOT EXISTS idx_notifications_organisation_id ON notifications(organisation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_settings_organisation_id ON settings(organisation_id);

-- ========================================
-- ENABLE RLS ON NEW TABLES
-- ========================================
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES FOR NEW TABLES (SAFE VERSION)
-- ========================================

-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view own organisation incidents" ON incident_reports;
DROP POLICY IF EXISTS "Users can manage own organisation incidents" ON incident_reports;
CREATE POLICY "Users can view own organisation incidents" ON incident_reports FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Users can manage own organisation incidents" ON incident_reports FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Forms policies
DROP POLICY IF EXISTS "Users can view own organisation forms" ON forms;
DROP POLICY IF EXISTS "Users can manage own organisation forms" ON forms;
CREATE POLICY "Users can view own organisation forms" ON forms FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Users can manage own organisation forms" ON forms FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Form submissions policies
DROP POLICY IF EXISTS "Users can view own organisation submissions" ON form_submissions;
DROP POLICY IF EXISTS "Users can manage own organisation submissions" ON form_submissions;
CREATE POLICY "Users can view own organisation submissions" ON form_submissions FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Users can manage own organisation submissions" ON form_submissions FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Audit logs policies (read-only for users)
DROP POLICY IF EXISTS "Audit logs can view own organisation logs" ON audit_logs;
CREATE POLICY "Audit logs can view own organisation logs" ON audit_logs FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Compliance records policies
DROP POLICY IF EXISTS "Compliance records can view own organisation records" ON compliance_records;
DROP POLICY IF EXISTS "Compliance records can manage own organisation records" ON compliance_records;
CREATE POLICY "Compliance records can view own organisation records" ON compliance_records FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Compliance records can manage own organisation records" ON compliance_records FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Notifications policies
DROP POLICY IF EXISTS "Notifications can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Notifications can update own notifications" ON notifications;
CREATE POLICY "Notifications can view own notifications" ON notifications FOR SELECT USING (user_id = (SELECT id FROM users WHERE email = auth.email()));
CREATE POLICY "Notifications can update own notifications" ON notifications FOR UPDATE USING (user_id = (SELECT id FROM users WHERE email = auth.email()));

-- Settings policies
DROP POLICY IF EXISTS "Settings can view own organisation settings" ON settings;
DROP POLICY IF EXISTS "Settings can manage own organisation settings" ON settings;
CREATE POLICY "Settings can view own organisation settings" ON settings FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Settings can manage own organisation settings" ON settings FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- ========================================
-- UPDATED_AT TRIGGER FOR NEW TABLES
-- ========================================
DROP TRIGGER IF EXISTS update_incident_reports_updated_at ON incident_reports;
DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
DROP TRIGGER IF EXISTS update_form_submissions_updated_at ON form_submissions;
DROP TRIGGER IF EXISTS update_compliance_records_updated_at ON compliance_records;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SAMPLE FORM DATA
-- ========================================
INSERT INTO forms (organisation_id, name, description, form_type, fields) VALUES
(
    (SELECT id FROM organisations WHERE email = 'info@coreguard.co.uk' LIMIT 1),
    'Daily Security Report',
    'End-of-shift security report form',
    'daily_report',
    '{
        "sections": [
            {
                "title": "Shift Summary",
                "fields": [
                    {"name": "shift_summary", "type": "textarea", "label": "Shift Summary", "required": true},
                    {"name": "incidents", "type": "textarea", "label": "Any Incidents", "required": false}
                ]
            },
            {
                "title": "Site Status",
                "fields": [
                    {"name": "site_condition", "type": "select", "label": "Site Condition", "options": ["Good", "Fair", "Poor"], "required": true},
                    {"name": "security_concerns", "type": "textarea", "label": "Security Concerns", "required": false}
                ]
            }
        ]
    }'
),
(
    (SELECT id FROM organisations WHERE email = 'info@coreguard.co.uk' LIMIT 1),
    'Incident Report Form',
    'Detailed incident reporting form',
    'incident_report',
    '{
        "sections": [
            {
                "title": "Incident Details",
                "fields": [
                    {"name": "incident_type", "type": "select", "label": "Incident Type", "options": ["Theft", "Vandalism", "Safety", "Other"], "required": true},
                    {"name": "description", "type": "textarea", "label": "Description", "required": true},
                    {"name": "severity", "type": "select", "label": "Severity", "options": ["Low", "Medium", "High", "Critical"], "required": true}
                ]
            },
            {
                "title": "Response Actions",
                "fields": [
                    {"name": "action_taken", "type": "textarea", "label": "Action Taken", "required": true},
                    {"name": "witnesses", "type": "text", "label": "Witnesses", "required": false}
                ]
            }
        ]
    }'
)
ON CONFLICT DO NOTHING;

-- ========================================
-- SAMPLE SETTINGS
-- ========================================
INSERT INTO settings (organisation_id, key, value, description, is_public) VALUES
(
    (SELECT id FROM organisations WHERE email = 'info@coreguard.co.uk' LIMIT 1),
    'company_name',
    'CoreGuard SMS UK',
    'Company name for reports and documents',
    true
),
(
    (SELECT id FROM organisations WHERE email = 'info@coreguard.co.uk' LIMIT 1),
    'check_call_interval',
    '60',
    'Default check call interval in minutes',
    false
),
(
    (SELECT id FROM organisations WHERE email = 'info@coreguard.co.uk' LIMIT 1),
    'auto_assign_incidents',
    'true',
    'Automatically assign incidents to available officers',
    false
)
ON CONFLICT (organisation_id, key) DO NOTHING;

-- ========================================
-- COMPLETION
-- ========================================
-- New schema additions completed!
-- You now have the complete CoreGuard SMS database schema.
