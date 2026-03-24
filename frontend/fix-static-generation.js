#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of all pages that need dynamic exports
const pagesToFix = [
  'AboutPage.js',
  'AuditLogPage.js',
  'CheckCallsPage.js',
  'CompliancePage.js',
  'ContactPage.js',
  'DashboardPage.js',
  'FormsPage.js',
  'LandingPage.js',
  'LoginPage.js',
  'LogsPage.js',
  'OfficerCheckCallPage.js',
  'OfficerDashboardPage.js',
  'OnboardingPage.js',
  'PartnersPage.js',
  'PersonnelPage.js',
  'PricingPage.js',
  'ProductsPage.js',
  'ResourcesPage.js',
  'RotaPage.js',
  'SecurityPage.js',
  'SettingsPage.js',
  'SitesPage.js'
];

const pagesDir = path.join(__dirname, 'src', 'pages');

// Dynamic exports to add
const dynamicExports = `// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = false;
`;

function fixPage(pageFile) {
  const filePath = path.join(pagesDir, pageFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${pageFile}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if dynamic exports already exist
  if (content.includes("export const dynamic = 'force-dynamic'")) {
    console.log(`✅ Already fixed: ${pageFile}`);
    return;
  }
  
  // Find the position after imports and before the export default function
  const lines = content.split('\n');
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export default function')) {
      insertIndex = i;
      break;
    }
  }
  
  if (insertIndex === -1) {
    console.log(`❌ Could not find export default in: ${pageFile}`);
    return;
  }
  
  // Insert the dynamic exports
  lines.splice(insertIndex, 0, dynamicExports);
  
  // Write back to file
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log(`✅ Fixed: ${pageFile}`);
}

// Fix all pages
console.log('🔧 Fixing static generation issues...\n');

pagesToFix.forEach(pageFile => {
  fixPage(pageFile);
});

console.log('\n✨ All pages fixed! Static generation disabled.');
