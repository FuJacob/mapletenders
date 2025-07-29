import { Request, Response } from 'express';
import { analyticsService, ActivityLogEntry } from '../services/analyticsService';

/**
 * Analytics Controller
 * Handles all analytics-related endpoints for dashboard data, ROI calculations, and performance tracking
 */
export class AnalyticsController {
  /**
   * Get comprehensive dashboard data for the authenticated user
   * GET /analytics/dashboard
   */
  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const dashboardData = await analyticsService.generateUserDashboard(userId);
      
      res.status(200).json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Error getting dashboard:', error);
      res.status(500).json({ 
        error: 'Failed to get dashboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Calculate ROI metrics for the authenticated user
   * GET /analytics/roi?timeFrame=monthly
   */
  async getROI(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { timeFrame = 'monthly' } = req.query;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!['weekly', 'monthly', 'yearly'].includes(timeFrame as string)) {
        res.status(400).json({ error: 'Invalid timeFrame. Must be weekly, monthly, or yearly' });
        return;
      }

      const roiData = await analyticsService.calculateROI(userId, timeFrame as string);
      
      res.status(200).json({
        success: true,
        data: roiData,
        timeFrame
      });
    } catch (error) {
      console.error('Error calculating ROI:', error);
      res.status(500).json({ 
        error: 'Failed to calculate ROI',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Generate performance report for the authenticated user
   * GET /analytics/performance?timeFrame=monthly
   */
  async getPerformanceReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { timeFrame = 'monthly' } = req.query;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!['weekly', 'monthly', 'yearly'].includes(timeFrame as string)) {
        res.status(400).json({ error: 'Invalid timeFrame. Must be weekly, monthly, or yearly' });
        return;
      }

      const reportData = await analyticsService.generatePerformanceReport(userId, timeFrame as string);
      
      res.status(200).json({
        success: true,
        data: reportData
      });
    } catch (error) {
      console.error('Error generating performance report:', error);
      res.status(500).json({ 
        error: 'Failed to generate performance report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Track user activity for analytics
   * POST /analytics/track
   */
  async trackActivity(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const {
        actionType,
        resourceType,
        resourceId,
        metadata,
        sessionId,
        duration,
        pageUrl,
        referrerUrl,
        responseTime
      } = req.body;

      if (!actionType) {
        res.status(400).json({ error: 'actionType is required' });
        return;
      }

      const activity: ActivityLogEntry = {
        actionType,
        resourceType,
        resourceId,
        metadata,
        sessionId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        duration,
        pageUrl,
        referrerUrl,
        responseTime
      };

      await analyticsService.trackUserActivity(userId, activity);
      
      res.status(200).json({
        success: true,
        message: 'Activity tracked successfully'
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
      res.status(500).json({ 
        error: 'Failed to track activity',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get market intelligence data
   * GET /analytics/market-intelligence?industry=IT&province=ON
   */
  async getMarketIntelligence(req: Request, res: Response): Promise<void> {
    try {
      const { industry, province } = req.query;
      
      const marketData = await analyticsService.getMarketIntelligence(
        industry as string,
        province as string
      );
      
      res.status(200).json({
        success: true,
        data: marketData
      });
    } catch (error) {
      console.error('Error getting market intelligence:', error);
      res.status(500).json({ 
        error: 'Failed to get market intelligence data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user's dashboard preferences
   * GET /analytics/preferences
   */
  async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const preferences = await analyticsService.getDashboardPreferences(userId);
      
      res.status(200).json({
        success: true,
        data: preferences
      });
    } catch (error) {
      console.error('Error getting preferences:', error);
      res.status(500).json({ 
        error: 'Failed to get dashboard preferences',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update user's dashboard preferences
   * PUT /analytics/preferences
   */
  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const preferences = req.body;
      
      await analyticsService.updateDashboardPreferences(userId, preferences);
      
      res.status(200).json({
        success: true,
        message: 'Dashboard preferences updated successfully'
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ 
        error: 'Failed to update dashboard preferences',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update tender performance tracking
   * PUT /analytics/tender-performance/:tenderId
   */
  async updateTenderPerformance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { tenderId } = req.params;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!tenderId) {
        res.status(400).json({ error: 'tenderId is required' });
        return;
      }

      const updates = req.body;
      
      // Convert date strings to Date objects if present
      if (updates.outcomeDate) {
        updates.outcomeDate = new Date(updates.outcomeDate);
      }
      
      await analyticsService.updateTenderPerformance(userId, tenderId, updates);
      
      res.status(200).json({
        success: true,
        message: 'Tender performance updated successfully'
      });
    } catch (error) {
      console.error('Error updating tender performance:', error);
      res.status(500).json({ 
        error: 'Failed to update tender performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get analytics summary for multiple time periods
   * GET /analytics/summary
   */
  async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Get data for multiple time periods
      const [dashboardData, weeklyROI, monthlyROI, yearlyROI] = await Promise.all([
        analyticsService.generateUserDashboard(userId),
        analyticsService.calculateROI(userId, 'weekly'),
        analyticsService.calculateROI(userId, 'monthly'),
        analyticsService.calculateROI(userId, 'yearly'),
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          dashboard: dashboardData,
          roi: {
            weekly: weeklyROI,
            monthly: monthlyROI,
            yearly: yearlyROI,
          }
        }
      });
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      res.status(500).json({ 
        error: 'Failed to get analytics summary',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Calculate time savings for a user
   * GET /analytics/time-savings
   */
  async getTimeSavings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { timeFrame = 'monthly' } = req.query;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const roiData = await analyticsService.calculateROI(userId, timeFrame as string);
      const preferences = await analyticsService.getDashboardPreferences(userId);
      
      const manualHoursPerOpportunity = preferences.manual_search_hours_per_opportunity || 2.5;
      const hourlyRate = preferences.hourly_rate || 75.00;
      
      // Calculate time savings based on opportunities found vs manual search time
      const performanceReport = await analyticsService.generatePerformanceReport(userId, timeFrame as string);
      const opportunitiesViewed = performanceReport.metrics.opportunitiesViewed;
      const manualSearchTime = opportunitiesViewed * manualHoursPerOpportunity;
      const actualTimeSpent = roiData.timeSavedHours;
      const timeSaved = manualSearchTime - actualTimeSpent;
      const moneySaved = timeSaved * hourlyRate;
      
      res.status(200).json({
        success: true,
        data: {
          timeFrame,
          opportunitiesViewed,
          manualSearchTimeRequired: manualSearchTime,
          actualTimeSpent,
          timeSavedHours: timeSaved,
          moneySavedCAD: moneySaved,
          hourlyRate,
          efficiencyPercentage: manualSearchTime > 0 ? (timeSaved / manualSearchTime) * 100 : 0
        }
      });
    } catch (error) {
      console.error('Error calculating time savings:', error);
      res.status(500).json({ 
        error: 'Failed to calculate time savings',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get recent user activities for dashboard
   * GET /analytics/activities?limit=10
   */
  async getUserActivities(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const { limit = 10 } = req.query;
      const activities = await analyticsService.getUserActivities(
        userId, 
        parseInt(limit as string)
      );
      
      res.status(200).json({
        success: true,
        data: activities
      });
    } catch (error) {
      console.error('Error getting user activities:', error);
      res.status(500).json({ 
        error: 'Failed to get user activities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const analyticsController = new AnalyticsController();