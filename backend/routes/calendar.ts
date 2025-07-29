import express from 'express';
import { calendarController } from '../controllers/calendarController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

// Apply authentication middleware to all calendar routes
router.use(authenticateUser);

/**
 * Calendar Provider Routes
 */

// GET /api/calendar/providers - Get available calendar providers
router.get('/providers', calendarController.getProviders.bind(calendarController));

/**
 * Google Calendar Routes
 */

// GET /api/calendar/google/auth - Get Google Calendar authorization URL
router.get('/google/auth', calendarController.getGoogleAuthUrl.bind(calendarController));

// GET /api/calendar/google/callback - Handle Google OAuth callback
router.get('/google/callback', calendarController.handleGoogleCallback.bind(calendarController));

/**
 * Calendar Connection Management Routes
 */

// GET /api/calendar/connections - Get user's calendar connections
router.get('/connections', calendarController.getConnections.bind(calendarController));

// PUT /api/calendar/connections/:connectionId - Update calendar connection settings
router.put('/connections/:connectionId', calendarController.updateConnection.bind(calendarController));

// DELETE /api/calendar/connections/:connectionId - Delete calendar connection
router.delete('/connections/:connectionId', calendarController.deleteConnection.bind(calendarController));

// POST /api/calendar/connections/:connectionId/test - Test calendar connection
router.post('/connections/:connectionId/test', calendarController.testConnection.bind(calendarController));

/**
 * Calendar Sync Routes
 */

// POST /api/calendar/sync - Sync tender deadlines to calendar
router.post('/sync', calendarController.syncDeadlines.bind(calendarController));

// GET /api/calendar/sync/history - Get calendar sync history
router.get('/sync/history', calendarController.getSyncHistory.bind(calendarController));

// GET /api/calendar/events/upcoming - Get upcoming calendar events
router.get('/events/upcoming', calendarController.getUpcomingEvents.bind(calendarController));

/**
 * Admin Routes
 */

// POST /api/calendar/bulk-sync - Bulk sync all users' calendars (admin)
router.post('/bulk-sync', calendarController.bulkSync.bind(calendarController));

export default router;