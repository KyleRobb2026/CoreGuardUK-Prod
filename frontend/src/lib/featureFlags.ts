// CoreGuard UK - Feature Flag System (Frontend)
// Central configuration for subscription-based feature access

export type Plan = 'core' | 'pro' | 'custom';
export type Feature = keyof typeof FEATURE_CONFIG;

// Core feature configuration
export const FEATURE_CONFIG = {
  // Core Plan Features (enabled)
  personnel_management: {
    core: true,
    pro: true,
    custom: true,
    description: 'Manage personnel records and assignments',
    category: 'operations'
  },
  site_management: {
    core: true,
    pro: true,
    custom: true,
    description: 'Manage multiple sites and locations',
    category: 'operations'
  },
  licence_tracking: {
    core: true,
    pro: true,
    custom: true,
    description: 'Track security licences and certifications',
    category: 'compliance'
  },
  basic_dashboard: {
    core: true,
    pro: true,
    custom: true,
    description: 'Basic operational dashboard',
    category: 'analytics'
  },
  
  // Pro Plan Features (disabled for Core)
  alerts: {
    core: false,
    pro: true,
    custom: true,
    description: '🚨 Licence expiry alerts and notifications',
    category: 'security'
  },
  incident_logging: {
    core: false,
    pro: true,
    custom: true,
    description: 'Log and track security incidents',
    category: 'operations'
  },
  advanced_analytics: {
    core: false,
    pro: true,
    custom: true,
    description: 'Advanced analytics and reporting',
    category: 'analytics'
  },
  api_access: {
    core: false,
    pro: true,
    custom: true,
    description: 'API access for integrations',
    category: 'integrations'
  },
  
  // Custom Plan Features
  custom_integrations: {
    core: false,
    pro: false,
    custom: true,
    description: 'Custom integrations and workflows',
    category: 'integrations'
  },
  priority_support: {
    core: false,
    pro: false,
    custom: true,
    description: 'Priority technical support',
    category: 'support'
  },
  custom_branding: {
    core: false,
    pro: false,
    custom: true,
    description: 'Custom branding and white-labeling',
    category: 'branding'
  }
} as const;

// Feature categories for UI organization
export const FEATURE_CATEGORIES = {
  operations: {
    name: 'Operations',
    description: 'Core operational features for security management',
    icon: 'Settings'
  },
  compliance: {
    name: 'Compliance',
    description: 'Regulatory compliance and certification tracking',
    icon: 'Shield'
  },
  analytics: {
    name: 'Analytics',
    description: 'Data insights and reporting capabilities',
    icon: 'BarChart3'
  },
  security: {
    name: 'Security',
    description: 'Security monitoring and alerting',
    icon: 'Lock'
  },
  integrations: {
    name: 'Integrations',
    description: 'Third-party integrations and API access',
    icon: 'Plug'
  },
  support: {
    name: 'Support',
    description: 'Customer support and service levels',
    icon: 'Headphones'
  },
  branding: {
    name: 'Branding',
    description: 'Customization and branding options',
    icon: 'Palette'
  }
} as const;

// Plan configurations
export const PLANS = {
  core: {
    name: 'Core',
    price: 15,
    description: 'Essential security management features',
    features: Object.entries(FEATURE_CONFIG)
      .filter(([_, config]) => config.core)
      .map(([feature]) => feature as Feature)
  },
  pro: {
    name: 'Pro',
    price: 30,
    description: 'Advanced features for growing security teams',
    features: Object.entries(FEATURE_CONFIG)
      .filter(([_, config]) => config.pro)
      .map(([feature]) => feature as Feature)
  },
  custom: {
    name: 'Custom',
    price: null,
    description: 'Tailored solutions for enterprise needs',
    features: Object.entries(FEATURE_CONFIG)
      .filter(([_, config]) => config.custom)
      .map(([feature]) => feature as Feature)
  }
} as const;

// Helper function to check if a feature is available for a plan
export function isFeatureAvailable(feature: Feature, plan: Plan): boolean {
  return FEATURE_CONFIG[feature][plan];
}

// Helper function to get all features for a plan
export function getPlanFeatures(plan: Plan): Feature[] {
  return Object.entries(FEATURE_CONFIG)
    .filter(([_, config]) => config[plan])
    .map(([feature]) => feature as Feature);
}

// Helper function to get features by category
export function getFeaturesByCategory(category: string): Feature[] {
  return Object.entries(FEATURE_CONFIG)
    .filter(([_, config]) => config.category === category)
    .map(([feature]) => feature as Feature);
}
