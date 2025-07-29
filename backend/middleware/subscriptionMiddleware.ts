import { Request, Response, NextFunction } from "express";
import { SubscriptionService } from "../services/subscriptionService";
import { DatabaseService } from "../services/databaseService";

interface AuthenticatedRequest extends Request {
  headers: Request["headers"] & {
    userId?: string;
  };
}

// Feature limits by plan
const PLAN_LIMITS = {
  starter: {
    searches_per_month: 100,
    active_alerts: 3,
    exports_per_month: 25,
    users: 1,
    api_access: false,
    advanced_search: false,
    win_probability: false,
    team_collaboration: false,
    custom_reports: false,
    priority_support: false,
  },
  professional: {
    searches_per_month: -1, // Unlimited
    active_alerts: 15,
    exports_per_month: -1, // Unlimited
    users: 5,
    api_access: true,
    advanced_search: true,
    win_probability: true,
    team_collaboration: true,
    custom_reports: true,
    priority_support: true,
  },
  enterprise: {
    searches_per_month: -1, // Unlimited
    active_alerts: -1, // Unlimited
    exports_per_month: -1, // Unlimited
    users: -1, // Unlimited
    api_access: true,
    advanced_search: true,
    win_probability: true,
    team_collaboration: true,
    custom_reports: true,
    priority_support: true,
    sso: true,
    white_label: true,
    custom_ai_training: true,
    dedicated_account_manager: true,
  },
};

export class SubscriptionMiddleware {
  private subscriptionService: SubscriptionService;

  constructor() {
    const databaseService = new DatabaseService();
    this.subscriptionService = new SubscriptionService(databaseService);
  }

  // Check if user has active subscription
  requireActiveSubscription = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user?.id || req.body.userId || req.params.userId;

      if (!userId) {
        res.status(401).json({
          error: "User authentication required",
          code: "AUTH_REQUIRED",
        });
      }

      const hasActiveSubscription =
        await this.subscriptionService.hasActiveSubscription(userId);

      if (!hasActiveSubscription) {
        res.status(403).json({
          error: "Active subscription required",
          code: "SUBSCRIPTION_REQUIRED",
          message:
            "This feature requires an active subscription. Please upgrade your plan.",
        });
      }

      next();
    } catch (error) {
      console.error("Error checking subscription:", error);
      res.status(500).json({
        error: "Failed to verify subscription status",
        code: "SUBSCRIPTION_CHECK_FAILED",
      });
    }
  };

  // Check specific feature access
  requireFeature = (feature: string) => {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId =
          req.headers.userId || req.body.userId || req.params.userId;

        if (!userId) {
          res.status(401).json({
            error: "User authentication required",
            code: "AUTH_REQUIRED",
          });
        }

        const subscription = await this.subscriptionService.getUserSubscription(
          userId
        );

        if (!subscription) {
          res.status(403).json({
            error: "Subscription required",
            code: "SUBSCRIPTION_REQUIRED",
            message:
              "This feature requires a subscription. Please choose a plan.",
          });
          return;
        }

        // Check if subscription is active
        if (!["active", "trialing"].includes(subscription.status)) {
          res.status(403).json({
            error: "Active subscription required",
            code: "SUBSCRIPTION_INACTIVE",
            message:
              "Your subscription is not active. Please update your payment method.",
          });
          return;
        }

        // Get plan limits based on plan name
        const planLimits = subscription.plan_id
          ? this.getPlanLimits(subscription.plan_id)
          : null;

        if (!planLimits) {
          res.status(500).json({
            error: "Unable to determine plan limits",
            code: "PLAN_LIMITS_ERROR",
          });
          return;
        }

        // Check if feature is available in this plan
        if (planLimits[feature as keyof typeof planLimits] === false) {
          res.status(403).json({
            error: "Feature not available in your plan",
            code: "FEATURE_NOT_AVAILABLE",
            message: `This feature is not available in your current plan. Please upgrade to access ${feature}.`,
            feature,
          });
          return;
        }

        // Add plan limits to request for usage tracking
        req.body._planLimits = planLimits;
        req.body._subscription = subscription;

        next();
      } catch (error) {
        console.error("Error checking feature access:", error);
        res.status(500).json({
          error: "Failed to verify feature access",
          code: "FEATURE_CHECK_FAILED",
        });
      }
    };
  };

  // Check usage limits (searches, exports, etc.)
  checkUsageLimit = (limitType: string) => {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const userId =
          req.headers.userId || req.body.userId || req.params.userId;

        if (!userId) {
          res.status(401).json({
            error: "User authentication required",
            code: "AUTH_REQUIRED",
          });
          return;
        }

        const subscription = await this.subscriptionService.getUserSubscription(
          userId
        );

        if (!subscription) {
          res.status(403).json({
            error: "Subscription required",
            code: "SUBSCRIPTION_REQUIRED",
          });
          return;
        }

        const planLimits = subscription.plan_id
          ? this.getPlanLimits(subscription.plan_id)
          : null;
        const limit = planLimits?.[limitType as keyof typeof planLimits];

        // If limit is -1, it's unlimited
        if (limit === -1) {
          next();
          return;
        }

        // TODO: Implement usage tracking in database
        // For now, we'll assume usage is within limits
        // In a real implementation, you'd track usage in the database

        next();
      } catch (error) {
        console.error("Error checking usage limit:", error);
        res.status(500).json({
          error: "Failed to verify usage limit",
          code: "USAGE_CHECK_FAILED",
        });
      }
    };
  };

  // Helper method to get plan limits
  private getPlanLimits(planId: string) {
    // Map plan IDs to plan names
    // This should ideally come from the database
    const planMapping: { [key: string]: keyof typeof PLAN_LIMITS } = {
      starter: "starter",
      professional: "professional",
      enterprise: "enterprise",
    };

    const planName = planMapping[planId] || "starter";
    return PLAN_LIMITS[planName];
  }

  // Get user's plan information
  getUserPlanInfo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user?.id || req.body.userId || req.params.userId;

      if (!userId) {
        res.status(401).json({
          error: "User authentication required",
          code: "AUTH_REQUIRED",
        });
      }

      const subscription = await this.subscriptionService.getUserSubscription(
        userId
      );
      const planLimits =
        subscription && subscription.plan_id
          ? this.getPlanLimits(subscription.plan_id)
          : null;

      // Add plan info to request
      req.body._planInfo = {
        subscription,
        limits: planLimits,
        hasActiveSubscription: subscription
          ? ["active", "trialing"].includes(subscription.status)
          : false,
      };

      next();
    } catch (error) {
      console.error("Error getting plan info:", error);
      res.status(500).json({
        error: "Failed to get plan information",
        code: "PLAN_INFO_ERROR",
      });
    }
  };
}

// Export middleware instance
export const subscriptionMiddleware = new SubscriptionMiddleware();

// Export specific middleware functions for easy use
export const requireActiveSubscription =
  subscriptionMiddleware.requireActiveSubscription;
export const requireFeature = subscriptionMiddleware.requireFeature;
export const checkUsageLimit = subscriptionMiddleware.checkUsageLimit;
export const getUserPlanInfo = subscriptionMiddleware.getUserPlanInfo;
