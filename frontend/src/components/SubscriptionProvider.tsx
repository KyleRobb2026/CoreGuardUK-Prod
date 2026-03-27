import React, { createContext, useContext, useEffect, useState } from 'react';
import { Plan, Feature, FEATURE_CONFIG, PLANS } from '../lib/featureFlags';

// Types for our subscription context
interface SubscriptionData {
  plan: Plan;
  status: 'active' | 'inactive' | 'trial';
  trialEndsAt?: Date;
  features: Array<{
    name: Feature;
    enabled: boolean;
    description: string;
    category: string;
  }>;
  disabledFeatures: Array<{
    name: Feature;
    enabled: boolean;
    description: string;
    category: string;
  }>;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  isFeatureEnabled: (feature: Feature) => boolean;
  getUpgradeMessage: (feature: Feature) => string;
  refreshSubscription: () => Promise<void>;
}

// Create the context
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider component
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/current');
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }

      const data = await response.json();
      setSubscription(data.data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription data');
      
      // Set default core plan on error
      setSubscription({
        plan: 'core',
        status: 'active',
        features: Object.entries(FEATURE_CONFIG).map(([name, config]) => ({
          name: name as Feature,
          enabled: config.core,
          description: config.description,
          category: config.category
        })),
        disabledFeatures: Object.entries(FEATURE_CONFIG)
          .filter(([_, config]) => !config.core)
          .map(([name, config]) => ({
            name: name as Feature,
            enabled: false,
            description: config.description,
            category: config.category
          }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh subscription data
  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  // Check if a feature is enabled
  const isFeatureEnabled = (feature: Feature): boolean => {
    if (!subscription) return false;
    
    const featureData = subscription.features.find(f => f.name === feature);
    return featureData?.enabled || false;
  };

  // Get upgrade message for a feature
  const getUpgradeMessage = (feature: Feature): string => {
    const config = FEATURE_CONFIG[feature];
    return `${config.description} requires a Pro plan subscription. Upgrade to unlock this feature.`;
  };

  // Fetch subscription on mount
  useEffect(() => {
    fetchSubscription();
  }, []);

  const value: SubscriptionContextType = {
    subscription,
    isLoading,
    error,
    isFeatureEnabled,
    getUpgradeMessage,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook to use subscription context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Feature gate component
interface FeatureGateProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeMessage?: boolean;
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgradeMessage = true 
}: FeatureGateProps) {
  const { isFeatureEnabled, getUpgradeMessage, subscription } = useSubscription();

  if (isFeatureEnabled(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback for locked features
  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-[#f7b91c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-[#f7b91c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Pro Feature</h3>
      {showUpgradeMessage && (
        <p className="text-[#676767] mb-4">
          {getUpgradeMessage(feature)}
        </p>
      )}
      {subscription?.plan === 'core' && (
        <UpgradeButton />
      )}
    </div>
  );
}

// Upgrade button component
export function UpgradeButton({ className = "" }: { className?: string }) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { refreshSubscription } = useSubscription();

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true);
      
      const response = await fetch('/api/billing/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'pro', dueDays: 7 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process upgrade');
      }

      const data = await response.json();
      
      await refreshSubscription();
      
      // Show invoice details
      alert(`Invoice issued successfully!\n\nReference: ${data.data.referenceNumber}\nAmount: £${data.data.amount}\nDue: ${new Date(data.data.dueDate).toLocaleDateString()}\n\nAccess will unlock once payment is received.`);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upgrade. Please try again.');
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={isUpgrading}
      className={`bg-[#f7b91c] text-[#1e1e1e] font-semibold py-2 px-4 rounded-lg hover:bg-[#e6a719] focus:outline-none focus:ring-2 focus:ring-[#f7b91c] focus:ring-offset-2 focus:ring-offset-[#171717] disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isUpgrading ? 'Processing...' : 'Upgrade to Pro'}
    </button>
  );
}

// Plan badge component
export function PlanBadge({ plan, className = "" }: { plan: Plan; className?: string }) {
  const colors = {
    core: 'bg-blue-900/20 text-blue-400 border-blue-500/30',
    pro: 'bg-[#f7b91c]/20 text-[#f7b91c] border-[#f7b91c]/30',
    custom: 'bg-purple-900/20 text-purple-400 border-purple-500/30'
  };

  const getPlanName = (plan: Plan) => {
    switch (plan) {
      case 'core': return 'Core';
      case 'pro': return 'Pro';
      case 'custom': return 'Custom';
      default: return plan;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[plan]} ${className}`}>
      {getPlanName(plan)}
    </span>
  );
}

// Feature list component
export function FeatureList({ showDisabled = false }: { showDisabled?: boolean }) {
  const { subscription } = useSubscription();

  if (!subscription) return null;

  const featuresToShow = showDisabled ? subscription.disabledFeatures : subscription.features.filter(f => f.enabled);

  return (
    <div className="space-y-4">
      {featuresToShow.map((feature) => (
        <div key={feature.name} className="flex items-center justify-between p-3 bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg">
          <div>
            <h4 className="text-white font-medium capitalize">
              {feature.name.replace(/_/g, ' ')}
            </h4>
            <p className="text-[#676767] text-sm">
              {feature.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#676767] capitalize">
              {feature.category}
            </span>
            {feature.enabled ? (
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Subscription status component
export function SubscriptionStatus() {
  const { subscription, isLoading, error } = useSubscription();

  if (isLoading) {
    return (
      <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-[#2e2e2e] rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-[#2e2e2e] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400 text-sm">
          Unable to load subscription information
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e1e1e] border border-[#2e2e2e] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-medium">Current Plan</h3>
        <PlanBadge plan={subscription.plan} />
      </div>
      
      <div className="flex items-center gap-2 text-sm text-[#676767]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="capitalize">{subscription.status}</span>
        {subscription.trialEndsAt && (
          <span>
            • Ends {new Date(subscription.trialEndsAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {subscription.plan === 'core' && (
        <div className="mt-4 pt-4 border-t border-[#2e2e2e]">
          <UpgradeButton className="w-full" />
        </div>
      )}
    </div>
  );
}
