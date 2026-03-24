// This file contains the dynamic export fixes for all pages
// Add these exports to the top of each problematic page file

// Add to ALL pages in src/pages/ directory:

export const dynamic = 'force-dynamic';
export const revalidate = false;

// This prevents Next.js from trying to statically generate these pages
// which are meant to be used only by React Router on the client side

// Pages that need this fix:
// - AboutPage.js
// - AuditLogPage.js  
// - CheckCallsPage.js
// - CompliancePage.js
// - ContactPage.js
// - DashboardPage.js
// - FormsPage.js
// - LandingPage.js
// - LoginPage.js
// - LogsPage.js
// - OfficerCheckCallPage.js
// - OfficerDashboardPage.js
// - OnboardingPage.js
// - PartnersPage.js
// - PersonnelPage.js
// - PricingPage.js
// - ProductsPage.js
// - ResourcesPage.js
// - RotaPage.js
// - SecurityPage.js
// - SettingsPage.js
// - SitesPage.js
