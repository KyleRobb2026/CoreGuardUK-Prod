import React, { useState } from 'react';
import { Check, X, Star, Users, Shield, TrendingUp, Building2, Zap, Lock } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'core' | 'pro' | 'custom' | null>(null);

  const plans = [
    {
      id: 'core',
      name: 'Core',
      price: billingCycle === 'monthly' ? '£15/month' : '£12/month',
      originalPrice: billingCycle === 'annual' ? '£15/month' : null,
      tagline: 'Get operational control',
      description: 'Built for small security teams getting started',
      color: 'blue',
      icon: Shield,
      features: [
        {
          name: 'Unlimited Users',
          included: true,
          highlight: true
        },
        {
          name: 'Unlimited Sites',
          included: true,
          highlight: true
        },
        {
          name: 'Personnel Management',
          included: true
        },
        {
          name: 'Site Management',
          included: true
        },
        {
          name: 'Licence Tracking',
          included: true
        },
        {
          name: 'Basic Dashboard',
          included: true
        },
        {
          name: 'Email Support',
          included: true
        },
        {
          name: '🚨 Licence Expiry Alerts',
          included: false
        },
        {
          name: '📝 Incident Logging System',
          included: false
        },
        {
          name: '📊 Reporting Dashboard',
          included: false
        }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? '£30/month' : '£24/month',
      originalPrice: billingCycle === 'annual' ? '£30/month' : null,
      tagline: 'Stay compliant and audit-ready',
      description: 'For growing companies that need compliance control',
      color: 'amber',
      icon: TrendingUp,
      features: [
        {
          name: 'Everything in Core',
          included: true,
          highlight: true
        },
        {
          name: '🚨 Licence Expiry Alerts',
          included: true,
          highlight: true
        },
        {
          name: '📝 Incident Logging System',
          included: true,
          highlight: true
        },
        {
          name: '📊 Reporting Dashboard',
          included: true,
          highlight: true
        },
        {
          name: '🔍 Compliance Monitoring',
          included: true,
          highlight: true
        },
        {
          name: 'Priority Email Support',
          included: true
        },
        {
          name: 'Unlimited Users & Sites',
          included: true
        },
        {
          name: 'Advanced Analytics',
          included: false
        },
        {
          name: 'API Access',
          included: false
        }
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 'Tailored Pricing',
      tagline: 'Enterprise-grade control & assurance',
      description: 'For large or regulated organisations',
      color: 'purple',
      icon: Building2,
      features: [
        {
          name: 'Everything in Pro',
          included: true,
          highlight: true
        },
        {
          name: 'Custom Feature Development',
          included: true,
          highlight: true
        },
        {
          name: 'Dedicated Support',
          included: true,
          highlight: true
        },
        {
          name: 'SLA Agreements',
          included: true,
          highlight: true
        },
        {
          name: 'Advanced Compliance Controls',
          included: true,
          highlight: true
        },
        {
          name: 'API Access',
          included: true
        },
        {
          name: 'Custom Integrations',
          included: true
        },
        {
          name: 'On-site Training',
          included: true
        },
        {
          name: 'Custom Reports',
          included: true
        }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const keySellingPoints = [
    {
      icon: Users,
      title: 'Unlimited Users & Sites',
      description: 'Huge advantage vs competitors - no hidden limits or per-user fees'
    },
    {
      icon: Lock,
      title: 'Built for Regulated Security',
      description: 'SIA-ready mindset, not generic SaaS - designed for security companies'
    },
    {
      icon: Shield,
      title: 'Compliance-First System',
      description: 'Purpose-built for security compliance, not adapted from other industries'
    }
  ];

  const handlePlanSelect = (planId: 'core' | 'pro' | 'custom') => {
    setSelectedPlan(planId);
    
    if (planId === 'custom') {
      // Open contact form or redirect to sales
      window.location.href = 'mailto:sales@coreguard.uk?subject=Custom Plan Inquiry';
    } else {
      // Redirect to signup with selected plan
      window.location.href = `/signup?plan=${planId}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#262626]">
      {/* Header */}
      <div className="bg-[#171717] border-b border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              💰 CoreGuard Pricing Plans
            </h1>
            <p className="text-xl text-[#676767] mb-8 max-w-3xl mx-auto">
              Enterprise-grade security management software built for regulated security companies
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-[#676767]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#2e2e2e] transition-colors"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#f7b91c] transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'annual' ? 'text-white' : 'text-[#676767]'}`}>
                Annual
              </span>
              {billingCycle === 'annual' && (
                <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key Selling Points */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {keySellingPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-[#f7b91c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <point.icon className="w-8 h-8 text-[#f7b91c]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-[#676767] text-sm">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#171717] border rounded-xl p-8 transition-all hover:scale-105 ${
                plan.popular
                  ? 'border-[#f7b91c] shadow-lg shadow-[#f7b91c]/20'
                  : 'border-[#2e2e2e]'
              } ${selectedPlan === plan.id ? 'ring-2 ring-[#f7b91c]' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#f7b91c] text-[#1e1e1e] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-[#1e1e1e] rounded-full flex items-center justify-center mx-auto mb-4">
                  <plan.icon className={`w-6 h-6 ${
                    plan.color === 'blue' ? 'text-blue-400' :
                    plan.color === 'amber' ? 'text-[#f7b91c]' :
                    'text-purple-400'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {plan.price}
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-[#676767] line-through">
                      {plan.originalPrice}
                    </div>
                  )}
                </div>
                <p className="text-[#676767] text-sm mb-2">{plan.tagline}</p>
                <p className="text-[#676767] text-xs">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <span className={`text-sm ${
                      feature.highlight ? 'text-white font-medium' : 'text-[#676767]'
                    } ${!feature.included && 'line-through'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-[#f7b91c] text-[#1e1e1e] hover:bg-[#e6a719]'
                    : plan.id === 'custom'
                    ? 'bg-purple-900/20 text-purple-400 border border-purple-500/30 hover:bg-purple-900/30'
                    : 'bg-[#1e1e1e] text-white border border-[#2e2e2e] hover:bg-[#2e2e2e]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Positioning Section */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🎯 How We Position It
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">🟢</div>
              <h3 className="text-lg font-semibold text-white mb-2">Core Plan</h3>
              <p className="text-[#676767] text-sm">
                "Get operational control"
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🔥</div>
              <h3 className="text-lg font-semibold text-white mb-2">Pro Plan</h3>
              <p className="text-[#676767] text-sm">
                "Stay compliant and audit-ready"
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-white mb-2">Custom Plan</h3>
              <p className="text-[#676767] text-sm">
                "Enterprise-grade control & assurance"
              </p>
            </div>
          </div>
          <p className="text-center text-[#676767] text-sm mt-6 italic">
            Don't sell features — sell outcomes
          </p>
        </div>

        {/* Future Add-ons */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            🚀 Future Revenue Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'SMS alerts (paid add-on)',
              'Extra storage',
              'Advanced audit exports',
              'Integrations'
            ].map((addon, index) => (
              <div key={index} className="bg-[#171717] border border-[#2e2e2e] rounded-lg p-4">
                <Zap className="w-6 h-6 text-[#f7b91c] mx-auto mb-2" />
                <p className="text-white text-sm">{addon}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
