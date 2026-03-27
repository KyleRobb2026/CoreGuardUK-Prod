import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';
import { SubscriptionService } from '../services/subscriptionService';
import { FeatureFlagService, Feature, Plan } from '../lib/featureFlags';

// Extend Request interface to include subscription data
declare global {
  namespace Express {
    interface Request {
      user?: any;
      subscription?: {
        plan: Plan;
        status: 'active' | 'inactive' | 'trial';
        trialEndsAt?: Date;
      };
    }
  }
}

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

// Middleware to enforce feature access
export const requireFeature = (feature: Feature) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user session
      const session = await auth.api.getSession({
        headers: getAuthHeaders(req)
      });

      if (!session?.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      // Get user's organisation and subscription
      const organisationId = (session.user as any).organisationId;
      if (!organisationId) {
        return res.status(403).json({
          error: 'No Organisation',
          message: 'User must belong to an organisation'
        });
      }

      // Get subscription with trial check
      const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
      
      if (!subscription) {
        return res.status(403).json({
          error: 'No Subscription',
          message: 'Organisation must have an active subscription'
        });
      }

      // Validate subscription status
      const validation = await SubscriptionService.validateSubscription(organisationId);
      if (!validation.valid) {
        return res.status(403).json({
          error: 'Invalid Subscription',
          message: validation.reason || 'Subscription is not valid'
        });
      }

      // Check feature access
      const hasFeature = FeatureFlagService.isFeatureEnabled(feature, subscription.plan);
      if (!hasFeature) {
        return res.status(403).json({
          error: 'Feature Not Available',
          message: `The ${feature} feature requires a Pro plan subscription. Upgrade to unlock this feature.`,
          feature,
          currentPlan: subscription.plan,
          requiredPlan: 'pro'
        });
      }

      // Attach subscription data to request for downstream use
      req.user = session.user;
      req.subscription = {
        plan: subscription.plan,
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt
      };

      next();
    } catch (error) {
      console.error('Feature enforcement error:', error);
      return res.status(500).json({
        error: 'Feature Check Failed',
        message: 'Unable to verify feature access'
      });
    }
  };
};

// Middleware to require valid subscription (regardless of feature)
export const requireSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: getAuthHeaders(req)
    });

    if (!session?.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Get user's organisation
    const organisationId = (session.user as any).organisationId;
    if (!organisationId) {
      return res.status(403).json({
        error: 'No Organisation',
        message: 'User must belong to an organisation'
      });
    }

    // Validate subscription
    const validation = await SubscriptionService.validateSubscription(organisationId);
    if (!validation.valid) {
      return res.status(403).json({
        error: 'Invalid Subscription',
        message: validation.reason || 'Subscription is not valid'
      });
    }

    // Attach subscription data to request
    req.user = session.user;
    if (validation.subscription) {
      req.subscription = {
        plan: validation.subscription.plan,
        status: validation.subscription.status,
        trialEndsAt: validation.subscription.trialEndsAt
      };
    }

    next();
  } catch (error) {
    console.error('Subscription validation error:', error);
    return res.status(500).json({
      error: 'Subscription Check Failed',
      message: 'Unable to verify subscription'
    });
  }
};

// Middleware to require admin role
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get user session
    const session = await auth.api.getSession({
      headers: getAuthHeaders(req)
    });

    if (!session?.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Check user role
    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return res.status(403).json({
        error: 'Insufficient Permissions',
        message: 'Admin privileges required'
      });
    }

    // Get subscription data
    const organisationId = (session.user as any).organisationId;
    if (organisationId) {
      const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
      req.user = session.user;
      if (subscription) {
        req.subscription = {
          plan: subscription.plan,
          status: subscription.status,
          trialEndsAt: subscription.trialEndsAt
        };
      }
    }

    next();
  } catch (error) {
    console.error('Admin validation error:', error);
    return res.status(500).json({
      error: 'Admin Check Failed',
      message: 'Unable to verify admin privileges'
    });
  }
};

// Middleware to check plan limits
export const checkPlanLimits = (limitType: 'users' | 'sites' | 'personnel') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user session and subscription
      const session = await auth.api.getSession({
        headers: getAuthHeaders(req)
      });

      if (!session?.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }

      const organisationId = (session.user as any).organisationId;
      if (!organisationId) {
        return res.status(401).json({
          error: 'No Organisation',
          message: 'User must belong to an organisation'
        });
      }

      const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(organisationId);
      if (!subscription) {
        return res.status(403).json({
          error: 'No Subscription',
          message: 'Organisation must have an active subscription'
        });
      }

      // Get current usage (this would need to be implemented based on your specific needs)
      const currentUsage = await getCurrentUsage(organisationId, limitType);
      
      // Get plan limits
      const limits = FeatureFlagService.getPlanLimits(subscription.plan);
      const limit = limits[limitType];

      // Check if within limits
      if (limit !== 'unlimited' && currentUsage >= limit) {
        return res.status(403).json({
          error: 'Plan Limit Exceeded',
          message: `Your ${subscription.plan} plan limit of ${limit} ${limitType} has been reached. Upgrade to Pro for unlimited access.`,
          currentUsage,
          limit,
          limitType
        });
      }

      // Attach subscription data to request
      req.user = session.user;
      req.subscription = {
        plan: subscription.plan,
        status: subscription.status,
        trialEndsAt: subscription.trialEndsAt
      };

      next();
    } catch (error) {
      console.error('Plan limit check error:', error);
      return res.status(500).json({
        error: 'Limit Check Failed',
        message: 'Unable to verify plan limits'
      });
    }
  };
};

// Helper function to get current usage (implement based on your needs)
async function getCurrentUsage(organisationId: string, type: 'users' | 'sites' | 'personnel'): Promise<number> {
  // This would query your database to get current usage
  // For now, return 0 as a placeholder
  return 0;
}

// Utility function to check if user can access feature (for use in controllers)
export const canUserAccessFeature = async (user: any, feature: Feature): Promise<{
  allowed: boolean;
  subscription?: any;
  reason?: string;
}> => {
  try {
    if (!user?.organisationId) {
      return { allowed: false, reason: 'User must belong to an organisation' };
    }

    const subscription = await SubscriptionService.getSubscriptionWithTrialCheck(user.organisationId);
    if (!subscription) {
      return { allowed: false, reason: 'No active subscription found' };
    }

    const validation = await SubscriptionService.validateSubscription(user.organisationId);
    if (!validation.valid) {
      return { allowed: false, reason: validation.reason };
    }

    const hasFeature = FeatureFlagService.isFeatureEnabled(feature, subscription.plan);
    if (!hasFeature) {
      return { 
        allowed: false, 
        reason: `The ${feature} feature requires a Pro plan subscription`,
        subscription
      };
    }

    return { allowed: true, subscription };
  } catch (error) {
    console.error('Feature access check error:', error);
    return { allowed: false, reason: 'Unable to verify feature access' };
  }
};
