import { Router } from "express";
import { authController } from "../container";

const router = Router();

/**
 * @route POST /auth/signup
 * @desc Register a new user account with email and password
 * @access Public
 * @param {Object} req.body - User registration data
 * @param {string} req.body.email - User email address (must be valid email format)
 * @param {string} req.body.password - User password (minimum 6 characters)
 * @returns {Object} res.json - User data and authentication session
 * @example
 * POST /auth/signup
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * Response: {
 *   "user": {
 *     "id": "uuid-123",
 *     "email": "user@example.com",
 *     "created_at": "2024-01-15T10:00:00Z"
 *   },
 *   "session": {
 *     "access_token": "jwt-token",
 *     "refresh_token": "refresh-token",
 *     "expires_in": 3600
 *   }
 * }
 */
router.post("/signup", (req, res) => {
  authController.signUp(req, res);
});

/**
 * @route POST /auth/signin
 * @desc Authenticate existing user with email and password
 * @access Public
 * @param {Object} req.body - User login credentials
 * @param {string} req.body.email - User email address
 * @param {string} req.body.password - User password
 * @returns {Object} res.json - User data and authentication session
 * @example
 * POST /auth/signin
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * Response: {
 *   "user": {
 *     "id": "uuid-123",
 *     "email": "user@example.com"
 *   },
 *   "session": {
 *     "access_token": "jwt-token",
 *     "refresh_token": "refresh-token"
 *   }
 * }
 */
router.post("/signin", (req, res) => {
  authController.signIn(req, res);
});

/**
 * @route POST /auth/signout
 * @desc Sign out the current user and invalidate session
 * @access Public
 * @param {string} [req.headers.authorization] - Bearer token for authenticated user
 * @returns {Object} res.json - Success confirmation message
 * @example
 * POST /auth/signout
 * Headers: { "Authorization": "Bearer jwt-token" }
 * Response: {
 *   "message": "Successfully signed out"
 * }
 */
router.post("/signout", (req, res) => {
  authController.signOut(req, res);
});

/**
 * @route GET /auth/user
 * @desc Get current authenticated user data and session information
 * @access Public
 * @param {string} [req.headers.authorization] - Bearer token for authentication
 * @returns {Object} res.json - Current user data and session status
 * @example
 * GET /auth/user
 * Headers: { "Authorization": "Bearer jwt-token" }
 * Response: {
 *   "user": {
 *     "id": "uuid-123",
 *     "email": "user@example.com",
 *     "created_at": "2024-01-15T10:00:00Z"
 *   },
 *   "session": {
 *     "expires_at": "2024-01-15T11:00:00Z"
 *   }
 * }
 */
router.get("/user", (req, res) => {
  authController.getUser(req, res);
});

/**
 * @route POST /auth/reset-password
 * @desc Send password reset email to user
 * @access Public
 * @param {Object} req.body - Password reset request data
 * @param {string} req.body.email - User email address to send reset link to
 * @returns {Object} res.json - Success confirmation message
 * @example
 * POST /auth/reset-password
 * {
 *   "email": "user@example.com"
 * }
 * Response: {
 *   "message": "Password reset email sent successfully"
 * }
 */
router.post("/reset-password", (req, res) => {
  authController.resetPassword(req, res);
});

/**
 * @route POST /auth/update-password
 * @desc Update user password using reset token from email
 * @access Public
 * @param {Object} req.body - Password update data
 * @param {string} req.body.password - New password (minimum 6 characters)
 * @param {string} req.body.access_token - Reset token from password reset email
 * @returns {Object} res.json - Success confirmation message
 * @example
 * POST /auth/update-password
 * {
 *   "password": "newsecurepassword123",
 *   "access_token": "reset-token-from-email"
 * }
 * Response: {
 *   "message": "Password updated successfully"
 * }
 */
router.post("/update-password", (req, res) => {
  authController.updatePassword(req, res);
});

export default router;
