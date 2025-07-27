import { Router } from "express";
import { subscriptionController } from "../container";
import express from "express";
import { authenticateUser } from "../middleware/authenticateUser";

const router = Router();

/**
 * Create checkout session for subscription
 * @route POST /subscriptions/checkout
 * @param {string} req.body.planId - Plan ID to subscribe to
 * @param {string} req.body.billingCycle - monthly or yearly
 * @param {string} req.body.userId - User ID
 * @param {string} req.body.email - User email
 * @param {string} req.body.name - User name (optional)
 * @returns {Object} Checkout session ID and URL
 * @access Private - requires authentication
 */
router.post("/checkout", authenticateUser, (req, res) => {
  subscriptionController.createCheckoutSession(req, res);
});

/**
 * Get user's subscription
 * @route GET /subscriptions/user/:userId
 * @param {string} req.params.userId - User ID
 * @returns {Object} User subscription data
 * @access Private - requires authentication
 */
router.get("/user/:userId", authenticateUser, (req, res) => {
  subscriptionController.getUserSubscription(req, res);
});

/**
 * Check subscription status
 * @route GET /subscriptions/status/:userId
 * @param {string} req.params.userId - User ID
 * @returns {Object} Subscription status and details
 * @access Private - requires authentication
 */
router.get("/status/:userId", authenticateUser, (req, res) => {
  subscriptionController.checkSubscriptionStatus(req, res);
});

/**
 * Cancel subscription
 * @route DELETE /subscriptions/user/:userId
 * @param {string} req.params.userId - User ID
 * @returns {Object} Cancellation confirmation
 * @access Private - requires authentication
 */
router.delete("/user/:userId", authenticateUser, (req, res) => {
  subscriptionController.cancelSubscription(req, res);
});

/**
 * Create billing portal session
 * @route POST /subscriptions/billing-portal/:userId
 * @param {string} req.params.userId - User ID
 * @returns {Object} Billing portal URL
 * @access Private - requires authentication
 */
router.post("/billing-portal/:userId", authenticateUser, (req, res) => {
  subscriptionController.createBillingPortalSession(req, res);
});

/**
 * Get all available plans
 * @route GET /subscriptions/plans
 * @returns {Array} List of subscription plans
 * @access Public - Available to all users for pricing display
 */
router.get("/plans", (req, res) => {
  subscriptionController.getPlans(req, res);
});

/**
 * Stripe webhook endpoint
 * @route POST /subscriptions/webhook
 * @param {Object} req.body - Stripe webhook event
 * @returns {Object} Webhook processing confirmation
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    subscriptionController.handleWebhook(req, res);
  }
);

export default router;
