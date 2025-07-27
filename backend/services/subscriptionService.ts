import Stripe from "stripe";
import { DatabaseService } from "./databaseService";
import emailService from "./emailService";
import type { Database } from "../database.types";

type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];
type SubscriptionInsert =
  Database["public"]["Tables"]["subscriptions"]["Insert"];
type SubscriptionUpdate =
  Database["public"]["Tables"]["subscriptions"]["Update"];
type PlanRow = Database["public"]["Tables"]["plans"]["Row"];

export class SubscriptionService {
  private stripe: Stripe;
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    this.databaseService = databaseService;
  }

  // Create Stripe customer
  async createCustomer(
    email: string,
    name?: string,
    userId?: string
  ): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          user_id: userId || "",
        },
      });
      return customer;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw error;
    }
  }

  // Create subscription with trial
  async createSubscription(
    customerId: string,
    priceId: string,
    userId: string,
    planId: string,
    billingCycle: "monthly" | "yearly"
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 14, // 7-day free trial
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          user_id: userId,
          plan_id: planId,
          billing_cycle: billingCycle,
        },
      });

      // Save subscription to database
      await this.saveSubscriptionToDatabase(
        subscription,
        userId,
        planId,
        billingCycle
      );

      return subscription;
    } catch (error) {
      console.error("Error creating Stripe subscription:", error);
      throw error;
    }
  }

  // Save subscription to database
  private async saveSubscriptionToDatabase(
    stripeSubscription: Stripe.Subscription,
    userId: string,
    planId: string,
    billingCycle: string
  ): Promise<void> {
    try {
      const subscriptionData: SubscriptionInsert = {
        user_id: userId,
        plan_id: planId,
        stripe_customer_id: stripeSubscription.customer as string,
        stripe_subscription_id: stripeSubscription.id,
        status: stripeSubscription.status,
        current_period_start: new Date(
          (stripeSubscription as any).current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          (stripeSubscription as any).current_period_end * 1000
        ).toISOString(),
        billing_cycle: billingCycle,
        trial_end: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toISOString()
          : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await this.databaseService.createSubscription(subscriptionData);
    } catch (error) {
      console.error("Error saving subscription to database:", error);
      throw error;
    }
  }

  // Update subscription status from webhook
  async updateSubscriptionStatus(
    stripeSubscriptionId: string,
    status: string,
    currentPeriodStart?: number,
    currentPeriodEnd?: number
  ): Promise<void> {
    try {
      const updateData: SubscriptionUpdate = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (currentPeriodStart) {
        updateData.current_period_start = new Date(
          currentPeriodStart * 1000
        ).toISOString();
      }
      if (currentPeriodEnd) {
        updateData.current_period_end = new Date(
          currentPeriodEnd * 1000
        ).toISOString();
      }

      await this.databaseService.updateSubscriptionByStripeId(
        stripeSubscriptionId,
        updateData
      );
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(
    subscriptionId: string
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(
        subscriptionId
      );

      // Update database
      await this.updateSubscriptionStatus(subscriptionId, "canceled");

      return subscription;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  // Create checkout session
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      // Only apply trial period for non-starter plans
      const subscriptionData: any = {
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
      };

      // Add trial period only for professional and enterprise plans
      if (planId !== "starter") {
        subscriptionData.trial_period_days = 14;
      }

      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: subscriptionData,
      });

      return session;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  // Get subscription by user ID
  async getUserSubscription(userId: string): Promise<SubscriptionRow | null> {
    try {
      return await this.databaseService.getSubscriptionByUserId(userId);
    } catch (error) {
      console.error("Error getting user subscription:", error);
      return null;
    }
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return false;

      return ["active", "trialing"].includes(subscription.status);
    } catch (error) {
      console.error("Error checking active subscription:", error);
      return false;
    }
  }

  // Get plan details
  async getPlan(planId: string): Promise<PlanRow | null> {
    try {
      return await this.databaseService.getPlan(planId);
    } catch (error) {
      console.error("Error getting plan:", error);
      return null;
    }
  }

  // Get all plans
  async getAllPlans(): Promise<PlanRow[]> {
    try {
      return await this.databaseService.getAllPlans();
    } catch (error) {
      console.error("Error getting all plans:", error);
      return [];
    }
  }

  // Create billing portal session
  async createBillingPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      console.error("Error creating billing portal session:", error);
      throw error;
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
  }

  // Handle subscription updated webhook
  async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await this.updateSubscriptionStatus(
        subscription.id,
        subscription.status,
        (subscription as any).current_period_start,
        (subscription as any).current_period_end
      );

      // Send subscription confirmation email if it's a new active subscription
      if (subscription.status === 'active' && subscription.metadata.user_id) {
        try {
          const customer = await this.stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          const plan = await this.getPlan(subscription.metadata.plan_id || '');
          
          if (customer.email && plan) {
            const billingCycle = subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';
            const amount = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
            
            await emailService.sendSubscriptionConfirmationEmail(
              customer.email,
              customer.name || customer.email.split('@')[0],
              plan.name,
              billingCycle,
              amount
            );
          }
        } catch (emailError) {
          console.error('Failed to send subscription confirmation email:', emailError);
        }
      }
    } catch (error) {
      console.error("Error handling subscription updated webhook:", error);
      throw error;
    }
  }

  // Handle subscription deleted webhook
  async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      await this.updateSubscriptionStatus(subscription.id, "canceled");
    } catch (error) {
      console.error("Error handling subscription deleted webhook:", error);
      throw error;
    }
  }

  // Handle invoice payment succeeded
  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      if ((invoice as any).subscription) {
        const stripeSubscription = await this.stripe.subscriptions.retrieve(
          (invoice as any).subscription as string
        );
        await this.handleSubscriptionUpdated(stripeSubscription);

        // Send invoice email
        try {
          const customer = await this.stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
          
          if (customer.email && invoice.invoice_pdf && invoice.number) {
            await emailService.sendInvoiceEmail(
              customer.email,
              customer.name || customer.email.split('@')[0],
              invoice.invoice_pdf,
              invoice.amount_paid / 100, // Convert from cents
              invoice.number
            );
          }
        } catch (emailError) {
          console.error('Failed to send invoice email:', emailError);
        }
      }
    } catch (error) {
      console.error("Error handling invoice payment succeeded webhook:", error);
      throw error;
    }
  }

  // Handle invoice payment failed
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    try {
      if ((invoice as any).subscription) {
        // Could send notification to user about failed payment
        console.log(
          `Payment failed for subscription: ${(invoice as any).subscription}`
        );
      }
    } catch (error) {
      console.error("Error handling invoice payment failed webhook:", error);
      throw error;
    }
  }
}
