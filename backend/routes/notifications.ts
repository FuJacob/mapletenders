import express from 'express';
import { notificationController } from '../controllers/notificationController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

// Apply authentication middleware to all notification routes
router.use(authenticateUser);

/**
 * User Notification Routes
 */

// GET /api/notifications - Get user notifications
router.get('/', notificationController.getNotifications.bind(notificationController));

// POST /api/notifications - Create a notification
router.post('/', notificationController.createNotification.bind(notificationController));

// PUT /api/notifications/:notificationId/read - Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead.bind(notificationController));

// PUT /api/notifications/read-all - Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead.bind(notificationController));

// DELETE /api/notifications/:notificationId - Delete notification
router.delete('/:notificationId', notificationController.deleteNotification.bind(notificationController));

/**
 * Notification Preferences Routes
 */

// GET /api/notifications/preferences - Get notification preferences
router.get('/preferences', notificationController.getPreferences.bind(notificationController));

// PUT /api/notifications/preferences - Update notification preferences
router.put('/preferences', notificationController.updatePreferences.bind(notificationController));

/**
 * System/Admin Routes
 */

// POST /api/notifications/deadline-alerts - Create deadline alerts (admin)
router.post('/deadline-alerts', notificationController.createDeadlineAlerts.bind(notificationController));

// POST /api/notifications/send-pending - Send pending notifications (admin)
router.post('/send-pending', notificationController.sendPendingNotifications.bind(notificationController));

// POST /api/notifications/test - Create test notification (development)
router.post('/test', notificationController.testNotification.bind(notificationController));

export default router;