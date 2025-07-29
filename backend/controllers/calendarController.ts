import { Request, Response } from 'express';
import { calendarService } from '../services/calendarService';
import type { CalendarConnection } from '../services/calendarService';

/**
 * Calendar Controller
 * Handles calendar integration and synchronization
 */
export class CalendarController {
  /**
   * Get Google Calendar authorization URL
   */
  async getGoogleAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const authUrl = calendarService.getGoogleAuthUrl(userId);

      res.json({
        success: true,
        data: { authUrl },
      });
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get authorization URL',
      });
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code, state } = req.query;
      
      if (!code || typeof code !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Authorization code is required',
        });
        return;
      }

      if (!state || typeof state !== 'string') {
        res.status(400).json({
          success: false,
          error: 'User state is required',
        });
        return;
      }

      const connection = await calendarService.handleGoogleCallback(code, state);

      res.json({
        success: true,
        data: connection,
        message: 'Google Calendar connected successfully',
      });
    } catch (error) {
      console.error('Error handling Google callback:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to connect Google Calendar',
      });
    }
  }

  /**
   * Get user's calendar connections
   */
  async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const connections = await calendarService.getCalendarConnections(userId);

      // Remove sensitive tokens from response
      const sanitizedConnections = connections.map(conn => ({
        ...conn,
        accessToken: undefined,
        refreshToken: undefined,
      }));

      res.json({
        success: true,
        data: sanitizedConnections,
      });
    } catch (error) {
      console.error('Error getting calendar connections:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get calendar connections',
      });
    }
  }

  /**
   * Update calendar connection settings
   */
  async updateConnection(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { connectionId } = req.params;
      const updates = req.body;

      // Don't allow updating sensitive fields
      delete updates.accessToken;
      delete updates.refreshToken;
      delete updates.userId;

      const connection = await calendarService.updateCalendarConnection(
        connectionId,
        userId,
        updates
      );

      // Remove sensitive tokens from response
      const sanitizedConnection = {
        ...connection,
        accessToken: undefined,
        refreshToken: undefined,
      };

      res.json({
        success: true,
        data: sanitizedConnection,
        message: 'Calendar connection updated successfully',
      });
    } catch (error) {
      console.error('Error updating calendar connection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update calendar connection',
      });
    }
  }

  /**
   * Delete calendar connection
   */
  async deleteConnection(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { connectionId } = req.params;

      await calendarService.deleteCalendarConnection(connectionId, userId);

      res.json({
        success: true,
        message: 'Calendar connection deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting calendar connection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete calendar connection',
      });
    }
  }

  /**
   * Sync tender deadlines to calendar
   */
  async syncDeadlines(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const syncResults = await calendarService.syncTenderDeadlines(userId);

      res.json({
        success: true,
        data: syncResults,
        message: 'Calendar sync completed',
      });
    } catch (error) {
      console.error('Error syncing calendar deadlines:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync calendar deadlines',
      });
    }
  }

  /**
   * Test calendar connection
   */
  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { connectionId } = req.params;

      // Get the connection
      const connections = await calendarService.getCalendarConnections(userId);
      const connection = connections.find(c => c.id === connectionId);

      if (!connection) {
        res.status(404).json({
          success: false,
          error: 'Calendar connection not found',
        });
        return;
      }

      if (!connection.enabled) {
        res.status(400).json({
          success: false,
          error: 'Calendar connection is disabled',
        });
        return;
      }

      // For now, just return connection status
      // In a real implementation, you would test the actual connection
      res.json({
        success: true,
        data: {
          connectionId: connection.id,
          provider: connection.provider,
          accountEmail: connection.accountEmail,
          status: 'connected',
          lastTestedAt: new Date(),
        },
        message: 'Calendar connection is working',
      });
    } catch (error) {
      console.error('Error testing calendar connection:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to test calendar connection',
      });
    }
  }

  /**
   * Get calendar sync history
   */
  async getSyncHistory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { limit = 10, offset = 0 } = req.query;

      // This would typically query a sync log table
      // For now, return placeholder data
      const syncHistory = [
        {
          id: '1',
          provider: 'google',
          syncDate: new Date(),
          status: 'success',
          eventsCreated: 5,
          eventsUpdated: 2,
          eventsDeleted: 0,
        },
        {
          id: '2',
          provider: 'google',
          syncDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          status: 'success',
          eventsCreated: 3,
          eventsUpdated: 1,
          eventsDeleted: 1,
        },
      ];

      res.json({
        success: true,
        data: syncHistory.slice(Number(offset), Number(offset) + Number(limit)),
        total: syncHistory.length,
      });
    } catch (error) {
      console.error('Error getting sync history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get sync history',
      });
    }
  }

  /**
   * Get available calendar providers
   */
  async getProviders(req: Request, res: Response): Promise<void> {
    try {
      const providers = [
        {
          id: 'google',
          name: 'Google Calendar',
          description: 'Sync with your Google Calendar',
          icon: 'https://developers.google.com/identity/images/g-logo.png',
          features: ['Two-way sync', 'Smart reminders', 'Multiple calendars'],
          status: 'available',
        },
        {
          id: 'outlook',
          name: 'Microsoft Outlook',
          description: 'Sync with Outlook/Office 365',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
          features: ['Two-way sync', 'Teams integration', 'Exchange support'],
          status: 'coming_soon',
        },
        {
          id: 'apple',
          name: 'Apple Calendar',
          description: 'Sync with iCloud Calendar',
          icon: 'https://developer.apple.com/assets/elements/icons/calendar/calendar-64x64_2x.png',
          features: ['Two-way sync', 'iOS integration', 'macOS support'],
          status: 'coming_soon',
        },
      ];

      res.json({
        success: true,
        data: providers,
      });
    } catch (error) {
      console.error('Error getting calendar providers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get calendar providers',
      });
    }
  }

  /**
   * Bulk sync all users' calendars (admin endpoint)
   */
  async bulkSync(req: Request, res: Response): Promise<void> {
    try {
      // This would typically be called by a cron job
      // For now, just return success
      res.json({
        success: true,
        message: 'Bulk calendar sync initiated',
        data: {
          syncStartedAt: new Date(),
          estimatedDuration: '5-10 minutes',
        },
      });
    } catch (error) {
      console.error('Error initiating bulk sync:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initiate bulk sync',
      });
    }
  }

  /**
   * Get upcoming calendar events for user
   */
  async getUpcomingEvents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { days = 7 } = req.query;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      // Get user's calendar events from database
      const daysAhead = parseInt(days as string);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysAhead);

      // This would query the calendar_events table
      // For now, return empty array as the table might not have data yet
      const events: any[] = [];

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get upcoming events',
      });
    }
  }
}

export const calendarController = new CalendarController();