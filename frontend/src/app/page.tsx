'use client';

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SupabaseProvider } from '../contexts/SupabaseContext';
import AppLayout from '../components/layout/AppLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import PersonnelPage from '../pages/PersonnelPage';
import SitesPage from '../pages/SitesPage';
import RotaPage from '../pages/RotaPage';
import LogsPage from '../pages/LogsPage';
import FormsPage from '../pages/FormsPage';
import CheckCallsPage from '../pages/CheckCallsPage';
import CompliancePage from '../pages/CompliancePage';
import AuditLogPage from '../pages/AuditLogPage';
import SettingsPage from '../pages/SettingsPage';
import OfficerDashboardPage from '../pages/OfficerDashboardPage';
import OfficerCheckCallPage from '../pages/OfficerCheckCallPage';

// Website Pages
import AboutPage from '../pages/AboutPage';
import ProductsPage from '../pages/ProductsPage';
import PricingPage from '../pages/PricingPage';
import ContactPage from '../pages/ContactPage';
import SecurityPage from '../pages/SecurityPage';

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

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/security" element={<SecurityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute adminOnly><AppLayout /></ProtectedRoute>}>
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
      <Route element={<OfficerRoute><AppLayout /></OfficerRoute>}>
        <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
        <Route path="/officer/logs" element={<LogsPage />} />
        <Route path="/officer/check-calls" element={<OfficerCheckCallPage />} />
        <Route path="/officer/forms" element={<FormsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <BrowserRouter>
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
      </AuthProvider>
    </SupabaseProvider>
  );
}
