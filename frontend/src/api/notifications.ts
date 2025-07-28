import apiClient from '../client/apiClient';

// Types for notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'deadline_alert' | 'new_tender' | 'saved_search_alert' | 'system_notification';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  channels: string[];
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface NotificationPreference {
  id?: string;
  userId: string;
  type: 'deadline_alert' | 'new_tender' | 'saved_search_alert' | 'system_notification';
  channels: string[];
  frequency: 'instant' | 'daily' | 'weekly';
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'teams' | 'in_app';
  enabled: boolean;
  settings?: Record<string, any>;
}

/**
 * Notifications API
 */
export const notificationsAPI = {
  /**
   * Get user notifications
   */
  async getNotifications(limit = 50, offset = 0, unreadOnly = false): Promise<Notification[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await apiClient.get(`/notifications?${params.toString()}`);
    return response.data.data.map((notification: any) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
      scheduledFor: notification.scheduledFor ? new Date(notification.scheduledFor) : undefined,
      sentAt: notification.sentAt ? new Date(notification.sentAt) : undefined,
    }));
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/notifications/read-all');
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  },

  /**
   * Create a notification
   */
  async createNotification(
    notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>
  ): Promise<Notification> {
    const response = await apiClient.post('/notifications', notification);
    return {
      ...response.data.data,
      createdAt: new Date(response.data.data.createdAt),
      scheduledFor: response.data.data.scheduledFor ? new Date(response.data.data.scheduledFor) : undefined,
      sentAt: response.data.data.sentAt ? new Date(response.data.data.sentAt) : undefined,
    };
  },

  /**
   * Get notification preferences
   */
  async getPreferences(): Promise<NotificationPreference[]> {
    const response = await apiClient.get('/notifications/preferences');
    return response.data.data;
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: NotificationPreference[]): Promise<void> {
    await apiClient.put('/notifications/preferences', preferences);
  },

  /**
   * Create test notification (development)
   */
  async createTestNotification(type = 'system_notification', channels = ['in_app']): Promise<Notification> {
    const response = await apiClient.post('/notifications/test', { type, channels });
    return {
      ...response.data.data,
      createdAt: new Date(response.data.data.createdAt),
    };
  },

  /**
   * Create deadline alerts (admin)
   */
  async createDeadlineAlerts(): Promise<void> {
    await apiClient.post('/notifications/deadline-alerts');
  },

  /**
   * Send pending notifications (admin)
   */
  async sendPendingNotifications(): Promise<void> {
    await apiClient.post('/notifications/send-pending');
  },
};

export default notificationsAPI;