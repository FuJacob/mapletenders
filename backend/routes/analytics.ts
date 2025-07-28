import express from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

/**
 * Analytics Routes
 * All routes require authentication
 */

// Dashboard data
router.get('/dashboard', authenticateUser, (req, res) => {
  analyticsController.getDashboard(req, res);
});

// ROI calculations
router.get('/roi', authenticateUser, (req, res) => {
  analyticsController.getROI(req, res);
});

// Performance reports
router.get('/performance', authenticateUser, (req, res) => {
  analyticsController.getPerformanceReport(req, res);
});

// Activity tracking
router.post('/track', authenticateUser, (req, res) => {
  analyticsController.trackActivity(req, res);
});

// Market intelligence (public data)
router.get('/market-intelligence', (req, res) => {
  analyticsController.getMarketIntelligence(req, res);
});

// Dashboard preferences
router.get('/preferences', authenticateUser, (req, res) => {
  analyticsController.getPreferences(req, res);
});

router.put('/preferences', authenticateUser, (req, res) => {
  analyticsController.updatePreferences(req, res);
});

// Tender performance tracking
router.put('/tender-performance/:tenderId', authenticateUser, (req, res) => {
  analyticsController.updateTenderPerformance(req, res);
});

// Analytics summary
router.get('/summary', authenticateUser, (req, res) => {
  analyticsController.getSummary(req, res);
});

// Time savings calculation
router.get('/time-savings', authenticateUser, (req, res) => {
  analyticsController.getTimeSavings(req, res);
});

export default router;