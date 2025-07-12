import axios from "axios";
import { handleApiError } from "./config";

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  stripe_product_id: string | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  features: any;
  limits: any;
  created_at: string | null;
  updated_at: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  billing_cycle: string;
  trial_end: string | null;
  usage_limits: any | null;
  created_at: string | null;
  updated_at: string | null;
  plan?: Plan;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  error?: string;
}

export interface SubscriptionStatusResponse {
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
  error?: string;
}

/**
 * Create Stripe checkout session
 * @param {string} planId - Plan ID to subscribe to
 * @param {string} billingCycle - monthly or yearly
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} name - User name (optional)
 * @returns {Promise<CheckoutSessionResponse>} Checkout session data
 */
export const createCheckoutSession = async (
  planId: string,
  billingCycle: "monthly" | "yearly",
  userId: string,
  email: string,
  name?: string
): Promise<CheckoutSessionResponse> => {
  try {
    const response = await axios.post("/subscriptions/checkout", {
      planId,
      billingCycle,
      userId,
      email,
      name,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create checkout session");
  }
};

/**
 * Get user's subscription
 * @param {string} userId - User ID
 * @returns {Promise<Subscription | null>} User subscription data
 */
export const getUserSubscription = async (
  userId: string
): Promise<Subscription | null> => {
  try {
    const response = await axios.get(`/subscriptions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user subscription:", error);
    return null;
  }
};

/**
 * Check subscription status
 * @param {string} userId - User ID
 * @returns {Promise<SubscriptionStatusResponse>} Subscription status
 */
export const checkSubscriptionStatus = async (
  userId: string
): Promise<SubscriptionStatusResponse> => {
  try {
    const response = await axios.get(`/subscriptions/status/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Check subscription status");
  }
};

/**
 * Cancel subscription
 * @param {string} userId - User ID
 * @returns {Promise<{message?: string, error?: string}>} Cancellation response
 */
export const cancelSubscription = async (
  userId: string
): Promise<{ message?: string; error?: string }> => {
  try {
    const response = await axios.delete(`/subscriptions/user/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Cancel subscription");
  }
};

/**
 * Create billing portal session
 * @param {string} userId - User ID
 * @returns {Promise<{url?: string, error?: string}>} Billing portal URL
 */
export const createBillingPortalSession = async (
  userId: string
): Promise<{ url?: string; error?: string }> => {
  try {
    const response = await axios.post(`/subscriptions/billing-portal/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create billing portal session");
  }
};

/**
 * Get all available plans
 * @returns {Promise<Plan[]>} List of subscription plans
 */
export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await axios.get("/subscriptions/plans");
    return response.data;
  } catch (error) {
    console.error("Error getting plans:", error);
    return [];
  }
};