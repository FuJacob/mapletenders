import { Request, Response } from "express";
import { SubscriptionService } from "../services";
import Stripe from "stripe";

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  // Create checkout session for subscription
  createCheckoutSession = async (req: Request, res: Response) => {
    try {
      const { planId, billingCycle, userId, email, name } = req.body;

      if (!planId || !billingCycle || !userId || !email) {
        return res.status(400).json({
          error: "planId, billingCycle, userId, and email are required",
        });
      }

      // Get plan details
      const plan = await this.subscriptionService.getPlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }

      // Create or get Stripe customer
      const customer = await this.subscriptionService.createCustomer(
        email,
        name,
        userId
      );

      // Get the correct price ID based on billing cycle
      const priceId =
        billingCycle === "yearly"
          ? plan.stripe_price_id_yearly
          : plan.stripe_price_id_monthly;

      if (!priceId) {
        return res.status(400).json({
          error: `Price ID not configured for ${billingCycle} billing`,
        });
      }

      // Create checkout session
      const session = await this.subscriptionService.createCheckoutSession(
        customer.id,
        priceId,
        userId,
        planId,
        `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        `${process.env.FRONTEND_URL}/pricing`
      );

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({
        error: error.message || "Failed to create checkout session",
      });
    }
  };

  // Get user's subscription
  getUserSubscription = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const subscription = await this.subscriptionService.getUserSubscription(
        userId
      );

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      res.json(subscription);
    } catch (error: any) {
      console.error("Error getting user subscription:", error);
      res.status(500).json({
        error: error.message || "Failed to get subscription",
      });
    }
  };

  // Cancel subscription
  cancelSubscription = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const subscription = await this.subscriptionService.getUserSubscription(
        userId
      );

      if (!subscription || !subscription.stripe_subscription_id) {
        return res.status(404).json({ error: "Active subscription not found" });
      }

      const canceledSubscription =
        await this.subscriptionService.cancelSubscription(
          subscription.stripe_subscription_id
        );

      res.json({
        message: "Subscription canceled successfully",
        subscription: canceledSubscription,
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({
        error: error.message || "Failed to cancel subscription",
      });
    }
  };

  // Create billing portal session
  createBillingPortalSession = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const subscription = await this.subscriptionService.getUserSubscription(
        userId
      );

      if (!subscription || !subscription.stripe_customer_id) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const session = await this.subscriptionService.createBillingPortalSession(
        subscription.stripe_customer_id,
        `${process.env.FRONTEND_URL}/profile`
      );

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error creating billing portal session:", error);
      res.status(500).json({
        error: error.message || "Failed to create billing portal session",
      });
    }
  };

  // Get all plans
  getPlans = async (req: Request, res: Response) => {
    try {
      const plans = await this.subscriptionService.getAllPlans();
      res.json(plans);
    } catch (error: any) {
      console.error("Error getting plans:", error);
      res.status(500).json({
        error: error.message || "Failed to get plans",
      });
    }
  };

  // Check subscription status
  checkSubscriptionStatus = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const hasActiveSubscription =
        await this.subscriptionService.hasActiveSubscription(userId);
      const subscription = await this.subscriptionService.getUserSubscription(
        userId
      );

      res.json({
        hasActiveSubscription,
        subscription: subscription || null,
      });
    } catch (error: any) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({
        error: error.message || "Failed to check subscription status",
      });
    }
  };

  // Stripe webhook handler
  handleWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    try {
      const event = this.subscriptionService.verifyWebhookSignature(
        req.body,
        signature
      );

      console.log("Received Stripe webhook:", event.type);

      // Handle different event types
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await this.subscriptionService.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await this.subscriptionService.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;

        case "invoice.payment_succeeded":
          await this.subscriptionService.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
          break;

        case "invoice.payment_failed":
          await this.subscriptionService.handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice
          );
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).json({
        error: error.message || "Webhook processing failed",
      });
    }
  };
}
