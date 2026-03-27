import { Router, Response } from 'express';
import { requireSubscription, requireAdmin } from '../lib/featureGuard';
import { SubscriptionService } from '../services/subscriptionService';

const router = Router();

// GET /api/subscription/current
// Get current subscription information
router.get('/current', requireSubscription(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
    
    if (!subscription) {
      return res.status(404).json({
        error: 'No Subscription',
        message: 'No active subscription found'
      });
    }

    // Get feature information
    const { FeatureFlagService } = require('../lib/featureFlags');
    const features = FeatureFlagService.getPlanFeatures(subscription.plan);
    const disabledFeatures = FeatureFlagService.getDisabledFeatures(subscription.plan);

    res.json({
      success: true,
      data: {
        plan: subscription.plan,
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt,
        features,
        disabledFeatures
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      error: 'Failed to fetch subscription',
      message: 'Internal server error'
    });
  }
});

// POST /api/subscription/upgrade
// Upgrade to Pro plan (admin only)
router.post('/upgrade', requireAdmin(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    // Check if already on Pro plan
    const currentSubscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
    if (currentSubscription?.plan === 'pro') {
      return res.status(400).json({
        error: 'Already Pro',
        message: 'Organisation is already on Pro plan'
      });
    }

    // Upgrade to Pro
    const upgradedSubscription = await SubscriptionService.upgradeToPro(organisationId);

    res.json({
      success: true,
      message: 'Successfully upgraded to Pro plan',
      data: {
        subscription: upgradedSubscription
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      error: 'Failed to upgrade subscription',
      message: 'Internal server error'
    });
  }
});

// POST /api/subscription/downgrade
// Downgrade to Core plan (admin only)
router.post('/downgrade', requireAdmin(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    // Check if already on Core plan
    const currentSubscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
    if (currentSubscription?.plan === 'core') {
      return res.status(400).json({
        error: 'Already Core',
        message: 'Organisation is already on Core plan'
      });
    }

    // Downgrade to Core
    const downgradedSubscription = await SubscriptionService.downgradeToCore(organisationId);

    res.json({
      success: true,
      message: 'Successfully downgraded to Core plan',
      data: {
        subscription: downgradedSubscription
      }
    });
  } catch (error) {
    console.error('Downgrade subscription error:', error);
    res.status(500).json({
      error: 'Failed to downgrade subscription',
      message: 'Internal server error'
    });
  }
});

// POST /api/subscription/start-trial
// Start Pro trial (admin only)
router.post('/start-trial', requireAdmin(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;
    const { trialDays = 14 } = req.body;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    // Start trial
    const trialSubscription = await SubscriptionService.startTrial(organisationId, trialDays);

    res.json({
      success: true,
      message: `Successfully started ${trialDays}-day Pro trial`,
      data: {
        subscription: trialSubscription
      }
    });
  } catch (error) {
    console.error('Start trial error:', error);
    res.status(500).json({
      error: 'Failed to start trial',
      message: 'Internal server error'
    });
  }
});

// GET /api/subscription/usage
// Get current usage statistics (admin only)
router.get('/usage', requireAdmin(), async (req, res) => {
  try {
    const user = req.user;
    const organisationId = (user as any).organisationId;

    if (!organisationId) {
      return res.status(400).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    // Get subscription and limits
    const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
    if (!subscription) {
      return res.status(404).json({
        error: 'No Subscription',
        message: 'No active subscription found'
      });
    }

    const { FeatureFlagService } = require('../lib/featureFlags');
    const limits = FeatureFlagService.getPlanLimits(subscription.plan);

    // Get current usage (mock data for now)
    const currentUsage = {
      users: 5,
      sites: 2,
      personnel: 25
    };

    // Calculate usage percentages
    const usagePercentages = {
      users: limits.users === 'unlimited' ? 0 : (currentUsage.users / limits.users) * 100,
      sites: limits.sites === 'unlimited' ? 0 : (currentUsage.sites / limits.sites) * 100,
      personnel: limits.personnel === 'unlimited' ? 0 : (currentUsage.personnel / limits.personnel) * 100
    };

    res.json({
      success: true,
      data: {
        plan: subscription.plan,
        limits,
        currentUsage,
        usagePercentages,
        nearLimits: Object.entries(usagePercentages)
          .filter(([_, percentage]) => typeof percentage === 'number' && percentage >= 80)
          .map(([resource]) => resource)
      }
    });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      error: 'Failed to fetch usage statistics',
      message: 'Internal server error'
    });
  }
});

// GET /api/subscription/plans
// Get available plans and features
router.get('/plans', async (req, res) => {
  try {
    const { FeatureFlagService, PLANS } = require('../lib/featureFlags');
    
    const planComparison = FeatureFlagService.getPlanComparison();

    res.json({
      success: true,
      data: {
        plans: planComparison,
        currentPlans: PLANS
      }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      error: 'Failed to fetch plans',
      message: 'Internal server error'
    });
  }
});

// GET /api/subscription/features
// Get all features and their availability
router.get('/features', async (req, res) => {
  try {
    const { FeatureFlagService, FEATURE_CATEGORIES } = require('../lib/featureFlags');
    
    const { FEATURE_CONFIG } = require('../lib/featureFlags');
    const featuresByCategory = Object.entries(FEATURE_CATEGORIES).map(([category, info]) => ({
      category,
      name: info.name,
      description: info.description,
      icon: info.icon,
      features: Object.entries(FEATURE_CONFIG || {})
        .filter(([_, config]) => config.category === category)
        .map(([name, config]) => ({
          name,
          description: config.description,
          core: config.core,
          pro: config.pro
        }))
    }));

    res.json({
      success: true,
      data: {
        featuresByCategory
      }
    });
  } catch (error) {
    console.error('Get features error:', error);
    res.status(500).json({
      error: 'Failed to fetch features',
      message: 'Internal server error'
    });
  }
});

export default router;
