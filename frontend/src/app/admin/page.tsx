'use client';

import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../components/SubscriptionProvider';
import { PlanBadge, UpgradeButton, FeatureList } from '../../components/SubscriptionProvider';
import { Shield, Users, Building2, AlertTriangle, TrendingUp, Settings, CreditCard, BarChart3, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const { subscription, isLoading, error, refreshSubscription } = useSubscription();
  const [usageData, setUsageData] = useState<any>(null);
  const [planComparison, setPlanComparison] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'usage' | 'features' | 'billing'>('overview');

  // Fetch usage data
  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const response = await fetch('/api/subscription/usage');
        if (response.ok) {
          const data = await response.json();
          setUsageData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      }
    };

    const fetchPlanComparison = async () => {
      try {
        const response = await fetch('/api/subscription/plans');
        if (response.ok) {
          const data = await response.json();
          setPlanComparison(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch plan comparison:', error);
      }
    };

    if (subscription) {
      fetchUsageData();
      fetchPlanComparison();
    }
  }, [subscription]);

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await refreshSubscription();
        alert('Successfully upgraded to Pro plan!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to upgrade');
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Failed to upgrade. Please try again.');
    }
  };

  const handleDowngrade = async () => {
    if (!confirm('Are you sure you want to downgrade to Core plan? You will lose access to Pro features.')) {
      return;
    }

    try {
      const response = await fetch('/api/subscription/downgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await refreshSubscription();
        alert('Successfully downgraded to Core plan');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to downgrade');
      }
    } catch (error) {
      console.error('Downgrade failed:', error);
      alert('Failed to downgrade. Please try again.');
    }
  };

  const startTrial = async () => {
    try {
      const response = await fetch('/api/subscription/start-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await refreshSubscription();
        alert('Successfully started Pro trial!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to start trial');
      }
    } catch (error) {
      console.error('Trial start failed:', error);
      alert('Failed to start trial. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#262626] flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#262626] flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-[#262626] flex items-center justify-center">
        <div className="text-white">No subscription data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#262626]">
      {/* Header */}
      <div className="bg-[#171717] border-b border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#f7b91c]" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <PlanBadge plan={subscription.plan} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#171717] border-b border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'usage', label: 'Usage', icon: TrendingUp },
              { id: 'features', label: 'Features', icon: Settings },
              { id: 'billing', label: 'Billing', icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#f7b91c] text-[#f7b91c]'
                    : 'border-transparent text-[#676767] hover:text-[#a0a0a0]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Current Plan</h3>
                  <p className="text-[#676767] text-sm">
                    {subscription.plan === 'core' && '£15/month'}
                    {subscription.plan === 'pro' && '£30/month'}
                    {subscription.plan === 'custom' && 'Tailored Pricing'}
                  </p>
                </div>
                <PlanBadge plan={subscription.plan} />
              </div>

              {/* Plan Highlights */}
              <div className="mb-6">
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">
                    {subscription.plan === 'core' && ' Core Plan - Get operational control'}
                    {subscription.plan === 'pro' && ' Pro Plan - Stay compliant and audit-ready'}
                    {subscription.plan === 'custom' && ' Custom Plan - Enterprise-grade control & assurance'}
                  </h4>
                  <p className="text-[#676767] text-sm">
                    {subscription.plan === 'core' && 'Unlimited Users & Sites • Personnel Management • Licence Tracking'}
                    {subscription.plan === 'pro' && 'Everything in Core • Licence Expiry Alerts • Incident Logging • Reporting'}
                    {subscription.plan === 'custom' && 'Everything in Pro • Custom Features • Dedicated Support • SLA Agreements'}
                  </p>
                </div>
              </div>

              {/* Usage Stats (showing unlimited advantage) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#676767] text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Users
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {usageData?.currentUsage?.users || 0}
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    Unlimited 
                  </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#676767] text-sm mb-1">
                    <Building2 className="w-4 h-4" />
                    Sites
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {usageData?.currentUsage?.sites || 0}
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    Unlimited 
                  </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#676767] text-sm mb-1">
                    <Shield className="w-4 h-4" />
                    Personnel
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {usageData?.currentUsage?.personnel || 0}
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    Unlimited 
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {subscription.plan === 'core' && (
                  <>
                    <UpgradeButton />
                    <button
                      onClick={startTrial}
                      className="px-4 py-2 bg-[#1e1e1e] text-white border border-[#2e2e2e] rounded-lg hover:bg-[#2e2e2e] transition-colors"
                    >
                      Start Free Trial
                    </button>
                  </>
                )}
                {subscription.plan === 'pro' && (
                  <>
                    <button
                      onClick={handleDowngrade}
                      className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-900/30 transition-colors"
                    >
                      Downgrade to Core
                    </button>
                    <button
                      className="px-4 py-2 bg-purple-900/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-900/30 transition-colors"
                    >
                      Contact Sales for Custom
                    </button>
                  </>
                )}
                {subscription.plan === 'custom' && (
                  <button
                    onClick={handleDowngrade}
                    className="px-4 py-2 bg-red-900/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-900/30 transition-colors"
                  >
                    Downgrade to Pro
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="w-8 h-8 text-orange-400" />
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <h3 className="text-white font-medium">Active Alerts</h3>
                <p className="text-[#676767] text-sm">Requires attention</p>
              </div>
              
              <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">25</span>
                </div>
                <h3 className="text-white font-medium">Total Personnel</h3>
                <p className="text-[#676767] text-sm">Across all sites</p>
              </div>
              
              <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-white font-medium">Active Sites</h3>
                <p className="text-[#676767] text-sm">Monitored locations</p>
              </div>
              
              <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-[#f7b91c]" />
                  <span className="text-2xl font-bold text-white">94%</span>
                </div>
                <h3 className="text-white font-medium">Compliance Score</h3>
                <p className="text-[#676767] text-sm">Overall performance</p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && usageData && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Usage Overview</h2>
            
            {Object.entries(usageData.currentUsage).map(([resource, current]: [string, any]) => {
              const limit = usageData.limits[resource as keyof typeof usageData.limits];
              const percentage = usageData.usagePercentages[resource as keyof typeof usageData.usagePercentages];
              const isNearLimit = usageData.nearLimits.includes(resource);
              
              return (
                <div key={resource} className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium capitalize">{resource}</h3>
                    <span className="text-[#676767]">
                      {current} of {limit === 'unlimited' ? 'Unlimited' : limit}
                    </span>
                  </div>
                  
                  {limit !== 'unlimited' && (
                    <div className="space-y-2">
                      <div className="w-full bg-[#1e1e1e] rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-colors ${
                            isNearLimit ? 'bg-orange-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${Math.min(percentage as number, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-[#676767]">
                        <span>{Math.round(percentage as number)}% used</span>
                        {isNearLimit && (
                          <span className="text-orange-400">⚠️ Near limit</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Feature Overview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Enabled Features
                </h3>
                <FeatureList showDisabled={false} />
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Upgrade to Unlock
                </h3>
                <FeatureList showDisabled={true} />
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white mb-4">Billing Information</h2>
            
            {/* Current Plan Details */}
            <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white font-medium">Current Plan</h3>
                  <p className="text-[#676767]">
                    {subscription.plan === 'core' ? '£29/month' : '£99/month'}
                  </p>
                </div>
                <PlanBadge plan={subscription.plan} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#676767]">Status</span>
                  <span className="text-white capitalize">{subscription.status}</span>
                </div>
                
                {subscription.trialEndsAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#676767]">Trial Ends</span>
                    <span className="text-white">
                      {new Date(subscription.trialEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-[#676767]">Next Billing</span>
                  <span className="text-white">
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Plan Comparison */}
            {planComparison && (
              <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-6">
                <h3 className="text-white font-medium mb-4">Plan Comparison</h3>
                
                <div className="space-y-4">
                  {planComparison.plans.map((plan: any) => (
                    <div
                      key={plan.plan}
                      className={`border rounded-lg p-4 ${
                        plan.plan === subscription.plan
                          ? 'border-[#f7b91c] bg-[#f7b91c]/10'
                          : 'border-[#2e2e2e]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{plan.name} Plan</h4>
                        <span className="text-[#f7b91c] font-semibold">{plan.price}</span>
                      </div>
                      <p className="text-[#676767] text-sm mb-3">{plan.description}</p>
                      
                      <div className="space-y-1">
                        {plan.features.slice(0, 3).map((feature: any) => (
                          <div key={feature.name} className="flex items-center gap-2 text-sm">
                            <svg
                              className={`w-4 h-4 ${
                                feature.enabled ? 'text-green-400' : 'text-gray-400'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {feature.enabled ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            <span className="text-[#676767] capitalize">
                              {feature.name.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {plan.plan !== subscription.plan && (
                        <button
                          onClick={plan.plan === 'pro' ? handleUpgrade : handleDowngrade}
                          className="mt-3 w-full py-2 bg-[#f7b91c] text-[#1e1e1e] font-medium rounded-lg hover:bg-[#e6a719] transition-colors"
                        >
                          {plan.plan === 'pro' ? 'Upgrade to Pro' : 'Downgrade to Core'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
