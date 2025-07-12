import { Router } from "express";
import { authController } from "../container";

const router = Router();

/**
 * Sign up a new user
 * @route POST /auth/signup
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {Object} User data and session
 */
router.post("/signup", (req, res) => {
  authController.signUp(req, res);
});

/**
 * Sign in an existing user
 * @route POST /auth/signin
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @returns {Object} User data and session
 */
router.post("/signin", (req, res) => {
  authController.signIn(req, res);
});

/**
 * Sign out the current user
 * @route POST /auth/signout
 * @returns {Object} Success message
 */
router.post("/signout", (req, res) => {
  authController.signOut(req, res);
});

/**
 * Get current session
 * @route GET /auth/session
 * @returns {Object} Session data
 */
router.get("/session", (req, res) => {
  authController.getSession(req, res);
});

/**
 * Send password reset email
 * @route POST /auth/reset-password
 * @param {string} req.body.email - User email
 * @returns {Object} Success message
 */
router.post("/reset-password", (req, res) => {
  authController.resetPassword(req, res);
});

/**
 * Update user password
 * @route POST /auth/update-password
 * @param {string} req.body.password - New password
 * @param {string} req.body.accessToken - Access token from reset link
 * @returns {Object} Success message
 */
router.post("/update-password", (req, res) => {
  authController.updatePassword(req, res);
});

export default router;
