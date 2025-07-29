import { Request, Response } from 'express';
import { notificationService } from '../services/notificationService';
import type { Notification, NotificationPreference } from '../services/notificationService';

/**
 * Notification Controller
 * Handles notification management and delivery
 */
export class NotificationController {
  /**
   * Get user notifications
   */
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { 
        limit = 50, 
        offset = 0, 
        unreadOnly = false 
      } = req.query;

      const notifications = await notificationService.getNotifications(
        userId,
        Number(limit),
        Number(offset),
        unreadOnly === 'true'
      );

      res.json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notifications',
      });
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { notificationId } = req.params;

      await notificationService.markAsRead(notificationId, userId);

      res.json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
      });
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      await notificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
      });
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { notificationId } = req.params;

      await notificationService.deleteNotification(notificationId, userId);

      res.json({
        success: true,
        message: 'Notification deleted',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete notification',
      });
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const notificationData: Omit<Notification, 'id' | 'createdAt' | 'userId'> = req.body;

      if (!notificationData.title || !notificationData.message) {
        res.status(400).json({
          success: false,
          error: 'Title and message are required',
        });
        return;
      }

      const notification = await notificationService.createNotification({
        ...notificationData,
        userId,
      });

      res.json({
        success: true,
        data: notification,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create notification',
      });
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      const preferences = await notificationService.getNotificationPreferences(userId);

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notification preferences',
      });
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const preferences: NotificationPreference[] = req.body;

      if (!Array.isArray(preferences)) {
        res.status(400).json({
          success: false,
          error: 'Preferences must be an array',
        });
        return;
      }

      await notificationService.updateNotificationPreferences(userId, preferences);

      res.json({
        success: true,
        message: 'Notification preferences updated',
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update notification preferences',
      });
    }
  }

  /**
   * Trigger deadline alerts creation (admin endpoint)
   */
  async createDeadlineAlerts(req: Request, res: Response): Promise<void> {
    try {
      await notificationService.createDeadlineAlerts();

      res.json({
        success: true,
        message: 'Deadline alerts created',
      });
    } catch (error) {
      console.error('Error creating deadline alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create deadline alerts',
      });
    }
  }

  /**
   * Send pending notifications (admin endpoint)
   */
  async sendPendingNotifications(req: Request, res: Response): Promise<void> {
    try {
      await notificationService.sendPendingNotifications();

      res.json({
        success: true,
        message: 'Pending notifications sent',
      });
    } catch (error) {
      console.error('Error sending pending notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send pending notifications',
      });
    }
  }

  /**
   * Test notification (development endpoint)
   */
  async testNotification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { type = 'system_notification', channels = ['in_app'] } = req.body;

      const notification = await notificationService.createNotification({
        userId,
        type,
        title: 'Test Notification',
        message: 'This is a test notification to verify the system is working.',
        data: { test: true },
        read: false,
        channels,
      });

      res.json({
        success: true,
        data: notification,
        message: 'Test notification created',
      });
    } catch (error) {
      console.error('Error creating test notification:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create test notification',
      });
    }
  }
}

export const notificationController = new NotificationController();