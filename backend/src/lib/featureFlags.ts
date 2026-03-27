// CoreGuard UK - Feature Flag System
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
    description: '📝 Incident logging system',
    category: 'security'
  },
  reporting: {
    core: false,
    pro: true,
    custom: true,
    description: '📊 Reporting dashboard',
    category: 'analytics'
  },
  compliance_monitoring: {
    core: false,
    pro: true,
    custom: true,
    description: '🔍 Compliance monitoring',
    category: 'compliance'
  },
  
  // Custom Plan Features (Pro + Custom only)
  advanced_analytics: {
    core: false,
    pro: false,
    custom: true,
    description: 'Predictive analytics and trend analysis',
    category: 'analytics'
  },
  api_access: {
    core: false,
    pro: false,
    custom: true,
    description: 'Full API access for integrations',
    category: 'integration'
  },
  bulk_operations: {
    core: false,
    pro: false,
    custom: true,
    description: 'Bulk upload and management operations',
    category: 'operations'
  },
  custom_reports: {
    core: false,
    pro: false,
    custom: true,
    description: 'Create and customize reports',
    category: 'analytics'
  },
  dedicated_support: {
    core: false,
    pro: false,
    custom: true,
    description: 'Dedicated customer support',
    category: 'support'
  },
  data_export: {
    core: false,
    pro: false,
    custom: true,
    description: 'Export data in multiple formats',
    category: 'analytics'
  },
  audit_logs: {
    core: false,
    pro: false,
    custom: true,
    description: 'Comprehensive audit trail and logs',
    category: 'security'
  },
  custom_features: {
    core: false,
    pro: false,
    custom: true,
    description: 'Custom feature development',
    category: 'integration'
  },
  sla_agreements: {
    core: false,
    pro: false,
    custom: true,
    description: 'SLA agreements and guarantees',
    category: 'support'
  }
} as const;

// Feature categories for UI organization
export const FEATURE_CATEGORIES = {
  operations: {
    name: 'Operations',
    description: 'Day-to-day operational features',
    icon: '🏢'
  },
  security: {
    name: 'Security',
    description: 'Security and safety features',
    icon: '🔒'
  },
  compliance: {
    name: 'Compliance',
    description: 'Regulatory compliance features',
    icon: '📋'
  },
  analytics: {
    name: 'Analytics',
    description: 'Data analysis and reporting',
    icon: '📊'
  },
  integration: {
    name: 'Integration',
    description: 'Third-party integrations',
    icon: '🔗'
  },
  support: {
    name: 'Support',
    description: 'Customer support features',
    icon: '💬'
  }
} as const;

// Plan definitions
export const PLANS = {
  core: {
    name: 'Core',
    description: 'Built for small security teams getting started',
    price: '£15/month',
    tagline: 'Get operational control',
    features: Object.keys(FEATURE_CONFIG).filter(
      feature => FEATURE_CONFIG[feature as Feature].core
    ),
    limits: {
      users: 'unlimited',
      sites: 'unlimited',
      personnel: 'unlimited'
    },
    support: 'Email Support',
    highlights: [
      'Unlimited Users & Sites',
      'Personnel Management',
      'Site Management',
      'Licence Tracking',
      'Basic Dashboard'
    ]
  },
  pro: {
    name: 'Pro',
    description: 'For growing companies that need compliance control',
    price: '£30/month',
    tagline: 'Stay compliant and audit-ready',
    features: Object.keys(FEATURE_CONFIG).filter(
      feature => FEATURE_CONFIG[feature as Feature].pro
    ),
    limits: {
      users: 'unlimited',
      sites: 'unlimited',
      personnel: 'unlimited'
    },
    support: 'Priority Email Support',
    highlights: [
      'Everything in Core',
      '🚨 Licence Expiry Alerts',
      '📝 Incident Logging System',
      '📊 Reporting Dashboard',
      '🔍 Compliance Monitoring'
    ]
  },
  custom: {
    name: 'Custom',
    description: 'For large or regulated organisations',
    price: 'Tailored Pricing',
    tagline: 'Enterprise-grade control & assurance',
    features: Object.keys(FEATURE_CONFIG), // All features
    limits: {
      users: 'unlimited',
      sites: 'unlimited',
      personnel: 'unlimited'
    },
    support: 'Dedicated Support',
    highlights: [
      'Everything in Pro',
      'Custom Feature Development',
      'Dedicated Support',
      'SLA Agreements',
      'Advanced Compliance Controls',
      'API Access'
    ]
  }
} as const;

// Feature flag utility functions
export class FeatureFlagService {
  // Check if a feature is enabled for a given plan
  static isFeatureEnabled(feature: Feature, plan: Plan): boolean {
    const featureConfig = FEATURE_CONFIG[feature];
    return featureConfig[plan];
  }

  // Get all features for a plan
  static getPlanFeatures(plan: Plan): Array<{
    name: Feature;
    enabled: boolean;
    description: string;
    category: string;
  }> {
    return Object.entries(FEATURE_CONFIG).map(([name, config]) => ({
      name: name as Feature,
      enabled: config[plan],
      description: config.description,
      category: config.category
    }));
  }

  // Get features by category for a plan
  static getFeaturesByCategory(plan: Plan): Record<string, Array<{
    name: Feature;
    enabled: boolean;
    description: string;
  }>> {
    const features = this.getPlanFeatures(plan);
    const categorized: Record<string, Array<{ name: Feature; enabled: boolean; description: string }>> = {};
    
    features.forEach(feature => {
      if (!categorized[feature.category]) {
        categorized[feature.category] = [];
      }
      categorized[feature.category].push({
        name: feature.name,
        enabled: feature.enabled,
        description: feature.description
      });
    });
    
    return categorized;
  }

  // Get disabled features for a plan (upgrade opportunities)
  static getDisabledFeatures(plan: Plan): Array<{
    name: Feature;
    description: string;
    category: string;
  }> {
    return Object.entries(FEATURE_CONFIG)
      .filter(([_, config]) => !config[plan])
      .map(([name, config]) => ({
        name: name as Feature,
        description: config.description,
        category: config.category
      }));
  }

  // Check if user can access a feature
  static canAccessFeature(feature: Feature, userPlan: Plan): boolean {
    return this.isFeatureEnabled(feature, userPlan);
  }

  // Get upgrade message for a feature
  static getUpgradeMessage(feature: Feature): string {
    const config = FEATURE_CONFIG[feature];
    return `${config.description} requires a Pro plan subscription. Upgrade to unlock this feature.`;
  }

  // Validate feature name
  static isValidFeature(feature: string): feature is Feature {
    return feature in FEATURE_CONFIG;
  }

  // Validate plan name
  static isValidPlan(plan: string): plan is Plan {
    return plan in PLANS;
  }

  // Get feature limits for a plan
  static getPlanLimits(plan: Plan) {
    return PLANS[plan].limits;
  }

  // Check if user is within plan limits
  static isWithinLimits(plan: Plan, usage: {
    users: number;
    sites: number;
    personnel: number;
  }): boolean {
    const limits = this.getPlanLimits(plan);
    
    return (
      (limits.users === 'unlimited' || usage.users <= limits.users) &&
      (limits.sites === 'unlimited' || usage.sites <= limits.sites) &&
      (limits.personnel === 'unlimited' || usage.personnel <= limits.personnel)
    );
  }

  // Get plan comparison data
  static getPlanComparison() {
    return Object.entries(PLANS).map(([planKey, planData]) => ({
      plan: planKey as Plan,
      name: planData.name,
      description: planData.description,
      price: planData.price,
      features: planData.features.map(feature => ({
        name: feature,
        enabled: FEATURE_CONFIG[feature as Feature][planKey as Plan],
        description: FEATURE_CONFIG[feature as Feature].description
      })),
      limits: planData.limits
    }));
  }
}

// Type guards
export function isFeatureEnabled(feature: Feature, plan: Plan): boolean {
  return FeatureFlagService.isFeatureEnabled(feature, plan);
}

export function canAccessFeature(feature: Feature, userPlan: Plan): boolean {
  return FeatureFlagService.canAccessFeature(feature, userPlan);
}
