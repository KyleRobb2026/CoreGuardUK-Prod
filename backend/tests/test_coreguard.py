"""CoreGuard SMS API tests - covers health, auth, onboarding, and main CRUD endpoints"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

# Test org credentials (use timestamp to avoid conflicts)
TS = str(int(time.time()))[-5:]
ORG_EMAIL = f"testorg{TS}@security.com"
ADMIN_EMAIL = f"admin{TS}@test.com"
ADMIN_PASSWORD = "Admin1234!"
ORG_NAME = f"TEST_Security_Ltd_{TS}"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def auth_data(session):
    """Register org and get auth token"""
    resp = session.post(f"{BASE_URL}/api/organisations/onboard", json={
        "org_data": {
            "name": ORG_NAME,
            "email": ORG_EMAIL,
            "phone": "07700123456"
        },
        "admin_data": {
            "first_name": "Test",
            "last_name": "Admin",
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
    })
    assert resp.status_code == 200, f"Onboarding failed: {resp.text}"
    data = resp.json()
    token = data["token"]
    org_id = data["organisation"]["id"]
    return {"token": token, "org_id": org_id}


@pytest.fixture(scope="module")
def authed_session(session, auth_data):
    session.headers.update({"Authorization": f"Bearer {auth_data['token']}"})
    return session


# ── Health ─────────────────────────────────────────────────────────────
class TestHealth:
    def test_health_check(self, session):
        resp = session.get(f"{BASE_URL}/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert data["status"] in ("healthy", "ok")


# ── Auth ──────────────────────────────────────────────────────────────
class TestAuth:
    def test_admin_login(self, session, auth_data):
        resp = session.post(f"{BASE_URL}/api/auth/admin-login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert data["actor_type"] == "admin"

    def test_admin_login_wrong_password(self, session):
        resp = session.post(f"{BASE_URL}/api/auth/admin-login", json={
            "email": ADMIN_EMAIL, "password": "wrongpass"
        })
        assert resp.status_code == 401

    def test_get_me(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data


# ── Organisations ─────────────────────────────────────────────────────
class TestOrganisations:
    def test_get_current_org(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/organisations/current")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == ORG_NAME

    def test_duplicate_org_email(self, session):
        resp = session.post(f"{BASE_URL}/api/organisations/onboard", json={
            "org_data": {"name": "Another Org", "email": ORG_EMAIL},
            "admin_data": {"first_name": "A", "last_name": "B", "email": f"other{TS}@test.com", "password": "Pass1234!"}
        })
        assert resp.status_code == 400


# ── Personnel ─────────────────────────────────────────────────────────
class TestPersonnel:
    @pytest.fixture(scope="class")
    def personnel_id(self, authed_session):
        resp = authed_session.post(f"{BASE_URL}/api/personnel", json={
            "first_name": "TEST_John",
            "last_name": "Doe",
            "email": f"test.john{TS}@guards.com",
            "role": "Security Officer"
        })
        assert resp.status_code == 200
        return resp.json()["id"]

    def test_create_personnel(self, authed_session):
        resp = authed_session.post(f"{BASE_URL}/api/personnel", json={
            "first_name": "TEST_Jane",
            "last_name": "Smith",
            "email": f"test.jane{TS}@guards.com"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["first_name"] == "TEST_Jane"
        assert "id" in data

    def test_list_personnel(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/personnel")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_generate_officer_code(self, authed_session, personnel_id):
        resp = authed_session.post(f"{BASE_URL}/api/personnel/{personnel_id}/generate-code")
        assert resp.status_code == 200
        data = resp.json()
        assert "code" in data
        assert "pin" in data


# ── Sites ─────────────────────────────────────────────────────────────
class TestSites:
    @pytest.fixture(scope="class")
    def site_id(self, authed_session):
        resp = authed_session.post(f"{BASE_URL}/api/sites", json={
            "name": f"TEST_Site_{TS}",
            "address": "1 Test Street, London",
            "type": "commercial"
        })
        assert resp.status_code == 200
        return resp.json()["id"]

    def test_create_site(self, authed_session):
        resp = authed_session.post(f"{BASE_URL}/api/sites", json={
            "name": f"TEST_Another_Site_{TS}",
            "address": "2 Test Avenue, Manchester"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data

    def test_list_sites(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/sites")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_get_site(self, authed_session, site_id):
        resp = authed_session.get(f"{BASE_URL}/api/sites/{site_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == site_id


# ── Logs ─────────────────────────────────────────────────────────────
class TestLogs:
    def test_create_log(self, authed_session):
        # Need a site first
        site_resp = authed_session.post(f"{BASE_URL}/api/sites", json={
            "name": f"TEST_LogSite_{TS}", "address": "3 Log Lane"
        })
        site_id = site_resp.json()["id"]

        resp = authed_session.post(f"{BASE_URL}/api/logs", json={
            "site_id": site_id,
            "type": "patrol",
            "title": "TEST_Patrol Log",
            "description": "All clear during patrol"
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["type"] == "patrol"
        assert "id" in data

    def test_list_logs(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/logs")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Forms ─────────────────────────────────────────────────────────────
class TestForms:
    def test_seed_prebuilt_forms(self, authed_session):
        resp = authed_session.post(f"{BASE_URL}/api/forms/seed-prebuilt")
        assert resp.status_code == 200
        data = resp.json()
        assert "Seeded" in data.get("message", "")

    def test_list_forms(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/forms")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Compliance ────────────────────────────────────────────────────────
class TestCompliance:
    def test_compliance_alerts(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/compliance/alerts")
        assert resp.status_code == 200
        data = resp.json()
        assert "alerts" in data
        assert "total" in data

    def test_risk_scores(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/compliance/risk-scores")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Dashboard ─────────────────────────────────────────────────────────
class TestDashboard:
    def test_dashboard_stats(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/dashboard/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "active_officers" in data
        assert "total_sites" in data
        assert "recent_shifts" in data


# ── Audit Logs ────────────────────────────────────────────────────────
class TestAuditLogs:
    def test_audit_logs(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/audit-logs")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)


# ── Users ─────────────────────────────────────────────────────────────
class TestUsers:
    def test_list_users(self, authed_session):
        resp = authed_session.get(f"{BASE_URL}/api/users")
        assert resp.status_code == 200
        users = resp.json()
        assert isinstance(users, list)
        assert len(users) >= 1
