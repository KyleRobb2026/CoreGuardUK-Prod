import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscriptionService';
import { FeatureFlagService, Feature, Plan } from '../lib/featureFlags';
import { auth } from '../lib/auth';

// Helper to get auth headers in correct format
function getAuthHeaders(req: Request) {
  const headers: Record<string, string> = {};
  if (req.headers.authorization) {
    headers.authorization = req.headers.authorization as string;
  }
  if (req.headers.cookie) {
    headers.cookie = req.headers.cookie as string;
  }
  return headers;
}

// Get user session from request
async function getUserSession(req: Request) {
  const session = await auth.api.getSession({
    headers: getAuthHeaders(req)
  });
  return session?.user || null;
}

// Get user's subscription plan
async function getUserPlan(user: any): Promise<Plan> {
  if (!user?.organisationId) {
    return 'core';
  }

  try {
    const subscription = await SubscriptionService.getActiveSubscription(user.organisationId);
    return subscription?.plan || 'core';
  } catch (error) {
    console.error('Failed to get user plan:', error);
    return 'core';
  }
}

// Get user's subscription plan with invoice status
async function getUserPlanWithBilling(user: any): Promise<{
  plan: Plan;
  canAccessProFeatures: boolean;
  paymentStatus: string;
}> {
  if (!user?.organisationId) {
    return { plan: 'core', canAccessProFeatures: false, paymentStatus: 'No organisation' };
  }

  try {
    const { InvoiceService } = require('../services/invoiceService');
    const billingOverview = await InvoiceService.getBillingOverview(user.organisationId);
    
    return {
      plan: billingOverview.subscription?.plan || 'core',
      canAccessProFeatures: billingOverview.canAccessProFeatures,
      paymentStatus: billingOverview.paymentStatus
    };
  } catch (error) {
    console.error('Failed to get user billing info:', error);
    return { plan: 'core', canAccessProFeatures: false, paymentStatus: 'Billing error' };
  }
}

// Validate user subscription
async function validateUserSubscription(user: any) {
  if (!user?.organisationId) {
    return { valid: false, reason: 'User must belong to an organisation' };
  }

  return await SubscriptionService.validateSubscription(user.organisationId);
}

// Reusable feature guard utility
export class FeatureGuard {
  /**
   * Check if user can access a specific feature
   * @param req - Express request object
   * @param feature - Feature to check access for
   * @returns Object with access status and details
   */
  static async requireFeature(req: Request, feature: Feature): Promise<{
    allowed: boolean;
    user?: any;
    subscription?: any;
    plan?: Plan;
    reason?: string;
    upgradeMessage?: string;
    paymentStatus?: string;
  }> {
    try {
      // Get user session
      const user = await getUserSession(req);
      if (!user) {
        return {
          allowed: false,
          reason: 'Authentication required'
        };
      }

      // Get user plan with billing info
      const billingInfo = await getUserPlanWithBilling(user);
      const { plan, canAccessProFeatures, paymentStatus } = billingInfo;
      
      // Check if feature is enabled for the plan
      const hasFeature = FeatureFlagService.isFeatureEnabled(feature, plan);
      if (!hasFeature) {
        return {
          allowed: false,
          user,
          plan,
          reason: `The ${feature} feature requires a Pro plan subscription`,
          upgradeMessage: FeatureFlagService.getUpgradeMessage(feature)
        };
      }

      // For Core plan features, allow access
      if (plan === 'core') {
        return {
          allowed: true,
          user,
          plan,
          paymentStatus
        };
      }

      // For Pro/Custom plan features, check payment status
      if (!canAccessProFeatures) {
        return {
          allowed: false,
          user,
          plan,
          reason: `Payment required for ${feature} feature`,
          upgradeMessage: `Invoice issued - access will unlock once payment is received. Current status: ${paymentStatus}`,
          paymentStatus
        };
      }

      return {
        allowed: true,
        user,
        plan,
        paymentStatus
      };
    } catch (error) {
      console.error('Feature guard error:', error);
      return {
        allowed: false,
        reason: 'Unable to verify feature access'
      };
    }
  }

  /**
   * Check if user has valid subscription (regardless of specific features)
   * @param req - Express request object
   * @returns Object with subscription status
   */
  static async requireSubscription(req: Request): Promise<{
    valid: boolean;
    user?: any;
    subscription?: any;
    plan?: Plan;
    reason?: string;
  }> {
    try {
      const user = await getUserSession(req);
      if (!user) {
        return {
          valid: false,
          reason: 'Authentication required'
        };
      }

      const subscriptionValidation = await validateUserSubscription(user);
      if (!subscriptionValidation.valid) {
        return {
          valid: false,
          user,
          reason: subscriptionValidation.reason || 'Invalid subscription'
        };
      }

      const billingInfo = await getUserPlanWithBilling(user);
      const plan = billingInfo.plan;

      return {
        valid: true,
        user,
        subscription: subscriptionValidation.valid ? (subscriptionValidation as any).subscription : undefined,
        plan
      };
    } catch (error) {
      console.error('Subscription guard error:', error);
      return {
        valid: false,
        reason: 'Unable to verify subscription'
      };
    }
  }

  /**
   * Check if user has admin role
   * @param req - Express request object
   * @returns Object with admin status
   */
  static async requireAdmin(req: Request): Promise<{
    allowed: boolean;
    user?: any;
    subscription?: any;
    plan?: Plan;
    reason?: string;
  }> {
    try {
      const user = await getUserSession(req);
      if (!user) {
        return {
          allowed: false,
          reason: 'Authentication required'
        };
      }

      const userRole = (user as any).role;
      if (userRole !== 'admin') {
        return {
          allowed: false,
          user,
          reason: 'Admin privileges required'
        };
      }

      const subscriptionValidation = await validateUserSubscription(user);
      const plan = await getUserPlan(user);

      return {
        allowed: true,
        user,
        subscription: subscriptionValidation.valid ? (subscriptionValidation as any).subscription : undefined,
        plan
      };
    } catch (error) {
      console.error('Admin guard error:', error);
      return {
        allowed: false,
        reason: 'Unable to verify admin privileges'
      };
    }
  }

  /**
   * Check if user is within plan limits
   * @param req - Express request object
   * @param limitType - Type of limit to check
   * @param currentUsage - Current usage count
   * @returns Object with limit status
   */
  static async checkPlanLimits(
    req: Request, 
    limitType: 'users' | 'sites' | 'personnel',
    currentUsage: number
  ): Promise<{
    allowed: boolean;
    user?: any;
    subscription?: any;
    plan?: Plan;
    reason?: string;
    currentUsage?: number;
    limit?: number | 'unlimited';
  }> {
    try {
      const subscriptionCheck = await this.requireSubscription(req);
      if (!subscriptionCheck.valid) {
        return {
          allowed: false,
          reason: subscriptionCheck.reason || 'Invalid subscription'
        };
      }

      const { subscription, plan } = subscriptionCheck;
      if (!subscription || !plan) {
        return {
          allowed: false,
          reason: 'No active subscription found'
        };
      }

      const limits = FeatureFlagService.getPlanLimits(plan);
      const limit = limits[limitType];

      if (limit !== 'unlimited' && currentUsage >= limit) {
        return {
          allowed: false,
          user: subscriptionCheck.user,
          subscription,
          plan,
          reason: `Your ${plan} plan limit of ${limit} ${limitType} has been reached`,
          currentUsage,
          limit
        };
      }

      return {
        allowed: true,
        user: subscriptionCheck.user,
        subscription,
        plan,
        currentUsage,
        limit
      };
    } catch (error) {
      console.error('Plan limit guard error:', error);
      return {
        allowed: false,
        reason: 'Unable to verify plan limits'
      };
    }
  }

  /**
   * Get user's plan information
   * @param req - Express request object
   * @returns User's plan and subscription details
   */
  static async getUserPlanInfo(req: Request): Promise<{
    plan: Plan;
    subscription?: any;
    features: Array<{
      name: Feature;
      enabled: boolean;
      description: string;
      category: string;
    }>;
    disabledFeatures: Array<{
      name: Feature;
      description: string;
      category: string;
    }>;
  }> {
    try {
      const user = await getUserSession(req);
      const plan = await getUserPlan(user);
      const subscription = (user as any)?.organisationId 
        ? await SubscriptionService.getSubscriptionWithTrialCheck((user as any).organisationId)
        : null;

      const features = FeatureFlagService.getPlanFeatures(plan);
      const disabledFeatures = FeatureFlagService.getDisabledFeatures(plan);

      return {
        plan,
        subscription,
        features,
        disabledFeatures
      };
    } catch (error) {
      console.error('Get plan info error:', error);
      // Return default core plan info on error
      return {
        plan: 'core',
        features: FeatureFlagService.getPlanFeatures('core'),
        disabledFeatures: FeatureFlagService.getDisabledFeatures('core')
      };
    }
  }

  /**
   * Middleware wrapper for feature enforcement
   * @param feature - Feature to enforce
   * @returns Express middleware function
   */
  static middleware(feature: Feature) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.requireFeature(req, feature);
      
      if (!result.allowed) {
        return res.status(403).json({
          error: 'Feature Not Available',
          message: result.reason,
          feature,
          currentPlan: result.plan,
          requiredPlan: 'pro',
          upgradeMessage: result.upgradeMessage
        });
      }

      // Attach user and subscription data to request
      req.user = result.user;
      if (result.subscription) {
        req.subscription = {
          plan: result.subscription.plan,
          status: result.subscription.status,
          trialEndsAt: result.subscription.trialEndsAt
        };
      }

      next();
    };
  }

  /**
   * Subscription middleware wrapper
   * @returns Express middleware function
   */
  static subscriptionMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.requireSubscription(req);
      
      if (!result.valid) {
        return res.status(403).json({
          error: 'Invalid Subscription',
          message: result.reason
        });
      }

      // Attach user and subscription data to request
      req.user = result.user;
      if (result.subscription) {
        req.subscription = {
          plan: result.subscription.plan,
          status: result.subscription.status,
          trialEndsAt: result.subscription.trialEndsAt
        };
      }

      next();
    };
  }

  /**
   * Admin middleware wrapper
   * @returns Express middleware function
   */
  static adminMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.requireAdmin(req);
      
      if (!result.allowed) {
        return res.status(403).json({
          error: 'Insufficient Permissions',
          message: result.reason
        });
      }

      // Attach user and subscription data to request
      req.user = result.user;
      if (result.subscription) {
        req.subscription = {
          plan: result.subscription.plan,
          status: result.subscription.status,
          trialEndsAt: result.subscription.trialEndsAt
        };
      }

      next();
    };
  }
}

// Convenience functions for common use cases
export const requireFeature = (feature: Feature) => FeatureGuard.middleware(feature);
export const requireSubscription = () => FeatureGuard.subscriptionMiddleware();
export const requireAdmin = () => FeatureGuard.adminMiddleware();

// Type guard for checking if a feature is enabled
export function isFeatureEnabled(feature: Feature, plan: Plan): boolean {
  return FeatureFlagService.isFeatureEnabled(feature, plan);
}
