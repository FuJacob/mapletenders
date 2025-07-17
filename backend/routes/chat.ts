import { Router } from "express";
import { chatController } from "../container";

const router = Router();

/**
 * @route POST /chat/session
 * @desc Create a new AI chat session for tender-related conversations
 * @access Public
 * @param {Object} [req.body] - Optional session configuration (currently unused)
 * @returns {Object} res.json - New chat session details
 * @example
 * POST /chat/session
 * Response: {
 *   "sessionId": "uuid-abc123",
 *   "message": "Chat session created successfully",
 *   "createdAt": "2024-01-15T10:00:00Z"
 * }
 */
router.post("/session", (req, res) => {
  chatController.createChatSession(req, res);
});

/**
 * @route POST /chat/session/:sessionId/message
 * @desc Send a message to an existing chat session and get AI response
 * @access Public
 * @param {string} req.params.sessionId - Unique identifier for the chat session
 * @param {Object} req.body - Message data to send
 * @param {string} req.body.message - User message content to send to AI
 * @returns {Object} res.json - AI response and session details
 * @example
 * POST /chat/session/uuid-abc123/message
 * {
 *   "message": "What are the latest IT tenders in Ontario?"
 * }
 * Response: {
 *   "message": "Here are the latest IT tenders in Ontario: ...",
 *   "sessionId": "uuid-abc123",
 *   "timestamp": "2024-01-15T10:05:00Z"
 * }
 */
router.post("/session/:sessionId/message", (req, res) => {
  chatController.sendMessage(req, res);
});

/**
 * @route DELETE /chat/session/:sessionId
 * @desc Delete a chat session and clear its conversation history
 * @access Public
 * @param {string} req.params.sessionId - Unique identifier for the chat session to delete
 * @returns {Object} res.json - Confirmation of session deletion
 * @example
 * DELETE /chat/session/uuid-abc123
 * Response: {
 *   "message": "Chat session deleted successfully",
 *   "sessionId": "uuid-abc123"
 * }
 */
router.delete("/session/:sessionId", (req, res) => {
  chatController.deleteChatSession(req, res);
});

export default router;
