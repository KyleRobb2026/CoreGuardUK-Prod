'use client';

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SupabaseProvider, useSupabase } from '../contexts/SupabaseContext';
import AppLayout from '../components/layout/AppLayout';
import SupabaseConfigWarning from '../components/SupabaseConfigWarning';
import ErrorBoundary from '../components/ErrorBoundary';

// Pages
import LandingPage from '../react-pages/LandingPage';
import LoginPage from '../react-pages/LoginPage';
import OnboardingPage from '../react-pages/OnboardingPage';
import DashboardPage from '../react-pages/DashboardPage';
import PersonnelPage from '../react-pages/PersonnelPage';
import SitesPage from '../react-pages/SitesPage';
import RotaPage from '../react-pages/RotaPage';
import LogsPage from '../react-pages/LogsPage';
import FormsPage from '../react-pages/FormsPage';
import CheckCallsPage from '../react-pages/CheckCallsPage';
import CompliancePage from '../react-pages/CompliancePage';
import AuditLogPage from '../react-pages/AuditLogPage';
import SettingsPage from '../react-pages/SettingsPage';
import OfficerDashboardPage from '../react-pages/OfficerDashboardPage';
import OfficerCheckCallPage from '../react-pages/OfficerCheckCallPage';

// Website Pages
import AboutPage from '../react-pages/AboutPage';
import ProductsPage from '../react-pages/ProductsPage';
import PricingPage from '../react-pages/PricingPage';
import ContactPage from '../react-pages/ContactPage';
import SecurityPage from '../react-pages/SecurityPage';
import PartnersPage from '../react-pages/PartnersPage';
import ResourcesPage from '../react-pages/ResourcesPage';
import StatusPage from '../react-pages/StatusPage';
import IncidentsPage from '../react-pages/IncidentsPage';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#262626] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#525252] border-t-[#007AFF] rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.actor_type === 'officer') return <Navigate to="/officer/dashboard" replace />;
  return <>{children}</>;
}

function OfficerRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function SupabaseGate({ children }: { children: React.ReactNode }) {
  const { isConfigured } = useSupabase();
  if (!isConfigured) return <SupabaseConfigWarning />;
  return <AuthProvider>{children}</AuthProvider>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes — no Supabase required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/status" element={<StatusPage />} />
      <Route path="/status/incidents" element={<IncidentsPage />} />

      {/* Auth & Protected Routes — require Supabase */}
      <Route element={<SupabaseGate><LoginPage /></SupabaseGate>} path="/login" />
      <Route element={<SupabaseGate><OnboardingPage /></SupabaseGate>} path="/onboarding" />

      {/* Admin routes */}
      <Route element={<SupabaseGate><ProtectedRoute adminOnly><AppLayout /></ProtectedRoute></SupabaseGate>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/personnel" element={<PersonnelPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/rota" element={<RotaPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/forms" element={<FormsPage />} />
        <Route path="/check-calls" element={<CheckCallsPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/audit" element={<AuditLogPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Officer routes */}
      <Route element={<SupabaseGate><OfficerRoute><AppLayout /></OfficerRoute></SupabaseGate>}>
        <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
        <Route path="/officer/logs" element={<LogsPage />} />
        <Route path="/officer/check-calls" element={<OfficerCheckCallPage />} />
        <Route path="/officer/forms" element={<FormsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <SupabaseProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#333333',
                border: '1px solid #525252',
                color: '#E5E5E5',
                borderRadius: '2px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
              },
            }}
          />
        </BrowserRouter>
      </SupabaseProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>CoreGuard UK</h1>
          <p style={{ color: '#a1a0a0' }}>Loading system...</p>
        </div>
      </div>
    );
  }

  return <AppContent />;
}
