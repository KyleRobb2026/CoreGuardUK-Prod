-- ========================================
-- CoreGuard SMS Database Schema
-- ========================================
-- Supabase PostgreSQL Database Setup
-- Connection: postgresql://postgres:Shainee1711@db.jchexyswrjefkteqfcco.supabase.co:5432/postgres

-- ========================================
-- 1. EXTENSIONS
-- ========================================
-- Enable UUID generation (already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. ORGANISATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS organisations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    company_number VARCHAR(50),
    vat_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Supabase auth handles this
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'admin' CHECK (actor_type IN ('admin', 'officer')),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. SITES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    post_code VARCHAR(20),
    contact_phone VARCHAR(50),
    site_type VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. PERSONNEL TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS personnel (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    officer_code VARCHAR(50) UNIQUE,
    pin_hash VARCHAR(255), -- For officer check-ins
    sire_number VARCHAR(50),
    license_number VARCHAR(50),
    license_expiry DATE,
    is_active BOOLEAN DEFAULT true,
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. SHIFTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS shifts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week TEXT[] DEFAULT ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. ROTA TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS rota (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'absent', 'late', 'left_early')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. CHECK CALLS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS check_calls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    personnel_id UUID REFERENCES personnel(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    rota_id UUID REFERENCES rota(id) ON DELETE SET NULL,
    call_type VARCHAR(50) DEFAULT 'regular' CHECK (call_type IN ('regular', 'emergency', 'incident')),
    scheduled_time TIMESTAMP WITH TIME ZONE,
    actual_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'missed', 'late')),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_address TEXT,
    notes TEXT,
    audio_url TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 9. INCIDENT REPORTS TABLE
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
-- 10. FORMS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS forms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    form_type VARCHAR(100) NOT NULL,
    fields JSONB NOT NULL, -- Form structure as JSON
    is_active BOOLEAN DEFAULT true,
    is_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. FORM SUBMISSIONS TABLE
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
-- 12. AUDIT LOGS TABLE
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
-- 13. COMPLIANCE RECORDS TABLE
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
-- 14. NOTIFICATIONS TABLE
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
-- 15. SETTINGS TABLE
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
-- 16. INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_users_organisation_id ON users(organisation_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_actor_type ON users(actor_type);

CREATE INDEX IF NOT EXISTS idx_sites_organisation_id ON sites(organisation_id);
CREATE INDEX IF NOT EXISTS idx_sites_is_active ON sites(is_active);

CREATE INDEX IF NOT EXISTS idx_personnel_organisation_id ON personnel(organisation_id);
CREATE INDEX IF NOT EXISTS idx_personnel_officer_code ON personnel(officer_code);
CREATE INDEX IF NOT EXISTS idx_personnel_is_active ON personnel(is_active);

CREATE INDEX IF NOT EXISTS idx_shifts_organisation_id ON shifts(organisation_id);
CREATE INDEX IF NOT EXISTS idx_shifts_site_id ON shifts(site_id);

CREATE INDEX IF NOT EXISTS idx_rota_organisation_id ON rota(organisation_id);
CREATE INDEX IF NOT EXISTS idx_rota_personnel_id ON rota(personnel_id);
CREATE INDEX IF NOT EXISTS idx_rota_site_id ON rota(site_id);
CREATE INDEX IF NOT EXISTS idx_rota_date ON rota(date);
CREATE INDEX IF NOT EXISTS idx_rota_status ON rota(status);

CREATE INDEX IF NOT EXISTS idx_check_calls_organisation_id ON check_calls(organisation_id);
CREATE INDEX IF NOT EXISTS idx_check_calls_personnel_id ON check_calls(personnel_id);
CREATE INDEX IF NOT EXISTS idx_check_calls_site_id ON check_calls(site_id);
CREATE INDEX IF NOT EXISTS idx_check_calls_status ON check_calls(status);
CREATE INDEX IF NOT EXISTS idx_check_calls_scheduled_time ON check_calls(scheduled_time);

CREATE INDEX IF NOT EXISTS idx_incident_reports_organisation_id ON incident_reports(organisation_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_status ON incident_reports(status);
CREATE INDEX IF NOT EXISTS idx_incident_reports_severity ON incident_reports(severity);

CREATE INDEX IF NOT EXISTS idx_form_submissions_organisation_id ON form_submissions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_organisation_id ON audit_logs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ========================================
-- 17. TRIGGERS FOR UPDATED_AT
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to all tables with updated_at
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personnel_updated_at BEFORE UPDATE ON personnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rota_updated_at BEFORE UPDATE ON rota FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_check_calls_updated_at BEFORE UPDATE ON check_calls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_records_updated_at BEFORE UPDATE ON compliance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 18. ROW LEVEL SECURITY (RLS)
-- ========================================
-- Enable RLS on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rota ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 19. RLS POLICIES
-- ========================================

-- Organisations policies
CREATE POLICY "Organisations can view own data" ON organisations FOR SELECT USING (auth.uid()::text = (SELECT id::text FROM users WHERE users.organisation_id = organisations.id AND users.email = auth.email()));
CREATE POLICY "Organisations can update own data" ON organisations FOR UPDATE USING (auth.uid()::text = (SELECT id::text FROM users WHERE users.organisation_id = organisations.id AND users.email = auth.email()));

-- Users policies
CREATE POLICY "Users can view own organisation users" ON users FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (email = auth.email());
CREATE POLICY "Users can insert own organisation users" ON users FOR INSERT WITH CHECK (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Sites policies
CREATE POLICY "Sites can view own organisation sites" ON sites FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Sites can manage own organisation sites" ON sites FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Personnel policies
CREATE POLICY "Personnel can view own organisation personnel" ON personnel FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Personnel can manage own organisation personnel" ON personnel FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Shifts policies
CREATE POLICY "Shifts can view own organisation shifts" ON shifts FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Shifts can manage own organisation shifts" ON shifts FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Rota policies
CREATE POLICY "Rota can view own organisation rota" ON rota FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Rota can manage own organisation rota" ON rota FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Check calls policies
CREATE POLICY "Check calls can view own organisation check calls" ON check_calls FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Check calls can manage own organisation check calls" ON check_calls FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Incident reports policies
CREATE POLICY "Incident reports can view own organisation incidents" ON incident_reports FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Incident reports can manage own organisation incidents" ON incident_reports FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Forms policies
CREATE POLICY "Forms can view own organisation forms" ON forms FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Forms can manage own organisation forms" ON forms FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Form submissions policies
CREATE POLICY "Form submissions can view own organisation submissions" ON form_submissions FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Form submissions can manage own organisation submissions" ON form_submissions FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Audit logs policies (read-only for users)
CREATE POLICY "Audit logs can view own organisation logs" ON audit_logs FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Compliance records policies
CREATE POLICY "Compliance records can view own organisation records" ON compliance_records FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Compliance records can manage own organisation records" ON compliance_records FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- Notifications policies
CREATE POLICY "Notifications can view own notifications" ON notifications FOR SELECT USING (user_id = (SELECT id FROM users WHERE email = auth.email()));
CREATE POLICY "Notifications can update own notifications" ON notifications FOR UPDATE USING (user_id = (SELECT id FROM users WHERE email = auth.email()));

-- Settings policies
CREATE POLICY "Settings can view own organisation settings" ON settings FOR SELECT USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));
CREATE POLICY "Settings can manage own organisation settings" ON settings FOR ALL USING (organisation_id = (SELECT organisation_id FROM users WHERE email = auth.email()));

-- ========================================
-- 20. SAMPLE DATA (Optional - for testing)
-- ========================================

-- Sample Organisation (you can remove this in production)
INSERT INTO organisations (name, email, phone, address) 
VALUES ('CoreGuard SMS UK', 'info@coreguard.co.uk', '+44 20 1234 5678', 'London, UK')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- 21. FUNCTIONS FOR COMMON OPERATIONS
-- ========================================

-- Function to get user's organisation
CREATE OR REPLACE FUNCTION get_user_organisation()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT organisation_id 
        FROM users 
        WHERE email = auth.email()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT actor_type = 'admin' 
        FROM users 
        WHERE email = auth.email()
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- COMPLETION
-- ========================================
-- Database schema created successfully!
-- Next steps:
-- 1. Run this SQL in Supabase SQL editor
-- 2. Test the connection using the React app
-- 3. Remove the test component from LandingPage
-- 4. Start integrating with your existing features
