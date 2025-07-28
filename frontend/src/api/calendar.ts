import apiClient from '../client/apiClient';

// Types for calendar integration
export interface CalendarConnection {
  id: string;
  userId: string;
  provider: 'google' | 'outlook' | 'apple';
  accountEmail: string;
  calendarId?: string;
  calendarName?: string;
  enabled: boolean;
  syncSettings: {
    syncDeadlines: boolean;
    syncBookmarked: boolean;
    syncSavedSearches: boolean;
    reminderMinutes: number[];
    eventPrefix: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  status: 'available' | 'coming_soon' | 'disabled';
}

export interface CalendarEvent {
  id: string;
  userId: string;
  tenderId: string;
  calendarConnectionId: string;
  externalEventId?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  url?: string;
  reminders: number[];
  status: 'pending' | 'synced' | 'failed';
  lastSyncAt?: Date;
  createdAt: Date;
}

export interface CalendarSync {
  userId: string;
  provider: 'google' | 'outlook' | 'apple';
  lastSyncAt: Date;
  syncStatus: 'success' | 'error' | 'partial';
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  errorMessage?: string;
}

export interface CalendarSyncHistory {
  id: string;
  provider: string;
  syncDate: Date;
  status: string;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
}

/**
 * Calendar API
 */
export const calendarAPI = {
  /**
   * Get available calendar providers
   */
  async getProviders(): Promise<CalendarProvider[]> {
    const response = await apiClient.get('/calendar/providers');
    return response.data.data;
  },

  /**
   * Get Google Calendar authorization URL
   */
  async getGoogleAuthUrl(): Promise<string> {
    const response = await apiClient.get('/calendar/google/auth');
    return response.data.data.authUrl;
  },

  /**
   * Handle Google OAuth callback (called by backend redirect)
   */
  async handleGoogleCallback(code: string, state: string): Promise<CalendarConnection> {
    const response = await apiClient.get(`/calendar/google/callback?code=${code}&state=${state}`);
    return {
      ...response.data.data,
      createdAt: new Date(response.data.data.createdAt),
      updatedAt: new Date(response.data.data.updatedAt),
    };
  },

  /**
   * Get user's calendar connections
   */
  async getConnections(): Promise<CalendarConnection[]> {
    const response = await apiClient.get('/calendar/connections');
    return response.data.data.map((connection: any) => ({
      ...connection,
      createdAt: new Date(connection.createdAt),
      updatedAt: new Date(connection.updatedAt),
    }));
  },

  /**
   * Update calendar connection settings
   */
  async updateConnection(
    connectionId: string, 
    updates: Partial<CalendarConnection>
  ): Promise<CalendarConnection> {
    const response = await apiClient.put(`/calendar/connections/${connectionId}`, updates);
    return {
      ...response.data.data,
      createdAt: new Date(response.data.data.createdAt),
      updatedAt: new Date(response.data.data.updatedAt),
    };
  },

  /**
   * Delete calendar connection
   */
  async deleteConnection(connectionId: string): Promise<void> {
    await apiClient.delete(`/calendar/connections/${connectionId}`);
  },

  /**
   * Test calendar connection
   */
  async testConnection(connectionId: string): Promise<any> {
    const response = await apiClient.post(`/calendar/connections/${connectionId}/test`);
    return response.data.data;
  },

  /**
   * Sync tender deadlines to calendar
   */
  async syncDeadlines(): Promise<CalendarSync[]> {
    const response = await apiClient.post('/calendar/sync');
    return response.data.data.map((sync: any) => ({
      ...sync,
      lastSyncAt: new Date(sync.lastSyncAt),
    }));
  },

  /**
   * Get calendar sync history
   */
  async getSyncHistory(limit = 10, offset = 0): Promise<{ data: CalendarSyncHistory[]; total: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await apiClient.get(`/calendar/sync/history?${params.toString()}`);
    return {
      data: response.data.data.map((history: any) => ({
        ...history,
        syncDate: new Date(history.syncDate),
      })),
      total: response.data.total,
    };
  },

  /**
   * Connect to Google Calendar (convenience method)
   */
  async connectGoogle(): Promise<string> {
    const authUrl = await this.getGoogleAuthUrl();
    
    // Open authorization window
    return new Promise((resolve, reject) => {
      const popup = window.open(
        authUrl,
        'google-calendar-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Failed to open authorization window'));
        return;
      }

      // Listen for popup to close or send message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if connection was successful by refetching connections
          this.getConnections().then(connections => {
            const googleConnection = connections.find(c => c.provider === 'google');
            if (googleConnection) {
              resolve(googleConnection.id);
            } else {
              reject(new Error('Authorization was cancelled or failed'));
            }
          }).catch(reject);
        }
      }, 1000);

      // Listen for message from popup (if using postMessage approach)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_CALENDAR_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.connectionId);
        } else if (event.data.type === 'GOOGLE_CALENDAR_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error || 'Authorization failed'));
        }
      };

      window.addEventListener('message', messageListener);
    });
  },

  /**
   * Get upcoming calendar events
   */
  async getUpcomingEvents(_daysAhead = 7): Promise<CalendarEvent[]> {
    // This would typically be a separate endpoint
    // For now, return empty array as placeholder
    return [];
  },

  /**
   * Enable/disable calendar connection
   */
  async toggleConnection(connectionId: string, enabled: boolean): Promise<CalendarConnection> {
    return this.updateConnection(connectionId, { enabled });
  },

  /**
   * Update sync settings for a connection
   */
  async updateSyncSettings(
    connectionId: string, 
    syncSettings: CalendarConnection['syncSettings']
  ): Promise<CalendarConnection> {
    return this.updateConnection(connectionId, { syncSettings });
  },
};

export default calendarAPI;