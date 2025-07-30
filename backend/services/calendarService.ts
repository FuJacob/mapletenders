import { DatabaseService } from "./databaseService";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const databaseService = new DatabaseService();
const supabase = (databaseService as any).supabase;

export interface CalendarConnection {
  id?: string;
  userId: string;
  provider: "google" | "outlook" | "apple";
  accountEmail: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CalendarEvent {
  id?: string;
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
  reminders: number[]; // Minutes before event
  status: "pending" | "synced" | "failed";
  lastSyncAt?: Date;
  createdAt?: Date;
}

export interface CalendarSync {
  userId: string;
  provider: "google" | "outlook" | "apple";
  lastSyncAt: Date;
  syncStatus: "success" | "error" | "partial";
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  errorMessage?: string;
}

export class CalendarService {
  private googleOAuth2Client: OAuth2Client;

  constructor() {
    this.googleOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Get Google Calendar authorization URL
   */
  getGoogleAuthUrl(userId: string): string {
    const scopes = [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const authUrl = this.googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: userId, // Pass user ID in state for callback
      prompt: "consent",
    });

    return authUrl;
  }

  /**
   * Handle Google OAuth callback and save connection
   */
  async handleGoogleCallback(
    code: string,
    userId: string
  ): Promise<CalendarConnection> {
    try {
      // Exchange code for tokens
      const response = await (this.googleOAuth2Client as any).getAccessToken(
        code
      );
      const tokens = response.tokens;

      if (!tokens.access_token) {
        throw new Error("No access token received");
      }

      this.googleOAuth2Client.setCredentials(tokens);

      // Get user info
      const oauth2 = google.oauth2({
        version: "v2",
        auth: this.googleOAuth2Client,
      });
      const userInfo = await oauth2.userinfo.get();

      // Get calendar list to find primary calendar
      const calendar = google.calendar({
        version: "v3",
        auth: this.googleOAuth2Client,
      });
      const calendarList = await calendar.calendarList.list();
      const primaryCalendar = calendarList.data.items?.find(
        (cal) => cal.primary
      );

      const connection: CalendarConnection = {
        userId,
        provider: "google",
        accountEmail: userInfo.data.email ?? "",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? undefined,
        expiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
        calendarId: primaryCalendar?.id ?? undefined,
        calendarName: primaryCalendar?.summary || "Primary",
        enabled: true,
        syncSettings: {
          syncDeadlines: true,
          syncBookmarked: true,
          syncSavedSearches: false,
          reminderMinutes: [60, 1440], // 1 hour and 1 day before
          eventPrefix: "[Tender] ",
        },
      };

      return await this.saveCalendarConnection(connection);
    } catch (error) {
      console.error("Error handling Google callback:", error);
      throw new Error("Failed to connect Google Calendar");
    }
  }

  /**
   * Save calendar connection to database
   */
  async saveCalendarConnection(
    connection: CalendarConnection
  ): Promise<CalendarConnection> {
    try {
      const { data, error } = await supabase
        .from("calendar_connections")
        .upsert(
          [
            {
              user_id: connection.userId,
              provider: connection.provider,
              account_email: connection.accountEmail,
              access_token: connection.accessToken,
              refresh_token: connection.refreshToken,
              expires_at: connection.expiresAt?.toISOString(),
              calendar_id: connection.calendarId,
              calendar_name: connection.calendarName,
              enabled: connection.enabled,
              sync_settings: connection.syncSettings,
              updated_at: new Date().toISOString(),
            },
          ],
          {
            onConflict: "user_id,provider",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToCalendarConnection(data);
    } catch (error) {
      console.error("Error saving calendar connection:", error);
      throw new Error("Failed to save calendar connection");
    }
  }

  /**
   * Get user's calendar connections
   */
  async getCalendarConnections(userId: string): Promise<CalendarConnection[]> {
    try {
      const { data, error } = await supabase
        .from("calendar_connections")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapDatabaseToCalendarConnection);
    } catch (error) {
      console.error("Error getting calendar connections:", error);
      throw new Error("Failed to get calendar connections");
    }
  }

  /**
   * Update calendar connection settings
   */
  async updateCalendarConnection(
    connectionId: string,
    userId: string,
    updates: Partial<CalendarConnection>
  ): Promise<CalendarConnection> {
    try {
      const { data, error } = await supabase
        .from("calendar_connections")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToCalendarConnection(data);
    } catch (error) {
      console.error("Error updating calendar connection:", error);
      throw new Error("Failed to update calendar connection");
    }
  }

  /**
   * Delete calendar connection
   */
  async deleteCalendarConnection(
    connectionId: string,
    userId: string
  ): Promise<void> {
    try {
      // First delete all associated calendar events
      await supabase
        .from("calendar_events")
        .delete()
        .eq("calendar_connection_id", connectionId)
        .eq("user_id", userId);

      // Then delete the connection
      const { error } = await supabase
        .from("calendar_connections")
        .delete()
        .eq("id", connectionId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting calendar connection:", error);
      throw new Error("Failed to delete calendar connection");
    }
  }

  /**
   * Sync tender deadlines to calendar
   */
  async syncTenderDeadlines(userId: string): Promise<CalendarSync[]> {
    try {
      const connections = await this.getCalendarConnections(userId);
      const results: CalendarSync[] = [];

      for (const connection of connections) {
        if (!connection.enabled || !connection.syncSettings.syncDeadlines) {
          continue;
        }

        const syncResult = await this.syncConnectionDeadlines(connection);
        results.push(syncResult);
      }

      return results;
    } catch (error) {
      console.error("Error syncing tender deadlines:", error);
      throw new Error("Failed to sync tender deadlines");
    }
  }

  /**
   * Sync deadlines for a specific connection
   */
  private async syncConnectionDeadlines(
    connection: CalendarConnection
  ): Promise<CalendarSync> {
    const syncResult: CalendarSync = {
      userId: connection.userId,
      provider: connection.provider,
      lastSyncAt: new Date(),
      syncStatus: "success",
      eventsCreated: 0,
      eventsUpdated: 0,
      eventsDeleted: 0,
    };

    try {
      // Get tenders that need calendar events
      const tendersToSync = await this.getTendersForSync(connection);

      if (connection.provider === "google") {
        await this.syncGoogleCalendarEvents(
          connection,
          tendersToSync,
          syncResult
        );
      } else if (connection.provider === "outlook") {
        await this.syncOutlookCalendarEvents(
          connection,
          tendersToSync,
          syncResult
        );
      }

      // Record sync result
      await this.recordSyncResult(syncResult);
    } catch (error) {
      console.error(`Error syncing ${connection.provider} calendar:`, error);
      syncResult.syncStatus = "error";
      syncResult.errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await this.recordSyncResult(syncResult);
    }

    return syncResult;
  }

  /**
   * Get tenders that need calendar sync
   */
  private async getTendersForSync(
    connection: CalendarConnection
  ): Promise<any[]> {
    try {
      let query = supabase
        .from("tenders")
        .select(
          "id, title, description, closing_date, contracting_entity_name, url"
        )
        .eq("status", "open")
        .gte("closing_date", new Date().toISOString());

      // Filter based on sync settings
      if (connection.syncSettings.syncBookmarked) {
        // Join with bookmarks to only get bookmarked tenders
        query = supabase
          .from("tenders")
          .select(
            `
            id, title, description, closing_date, contracting_entity_name, url,
            bookmarks!inner(user_id)
          `
          )
          .eq("status", "open")
          .eq("bookmarks.user_id", connection.userId)
          .gte("closing_date", new Date().toISOString());
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error getting tenders for sync:", error);
      return [];
    }
  }

  /**
   * Sync events to Google Calendar
   */
  private async syncGoogleCalendarEvents(
    connection: CalendarConnection,
    tenders: any[],
    syncResult: CalendarSync
  ): Promise<void> {
    try {
      // Refresh access token if needed
      await this.refreshGoogleToken(connection);

      this.googleOAuth2Client.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken,
      });

      const calendar = google.calendar({
        version: "v3",
        auth: this.googleOAuth2Client,
      });

      for (const tender of tenders) {
        try {
          const event = this.createCalendarEventFromTender(tender, connection);

          // Check if event already exists
          const existingEvent = await this.getExistingCalendarEvent(
            connection.id!,
            tender.id
          );

          if (existingEvent) {
            // Update existing event
            await calendar.events.update({
              calendarId: connection.calendarId!,
              eventId: existingEvent.externalEventId!,
              requestBody: event,
            });

            await this.updateCalendarEvent(existingEvent.id!, {
              ...existingEvent,
              title: event.summary!,
              description: event.description!,
              startTime: new Date(event.start!.dateTime!),
              endTime: new Date(event.end!.dateTime!),
              lastSyncAt: new Date(),
              status: "synced",
            });

            syncResult.eventsUpdated++;
          } else {
            // Create new event
            const response = await calendar.events.insert({
              calendarId: connection.calendarId!,
              requestBody: event,
            });

            await this.saveCalendarEvent({
              userId: connection.userId,
              tenderId: tender.id,
              calendarConnectionId: connection.id!,
              externalEventId: response.data.id ?? undefined,
              title: event.summary!,
              description: event.description!,
              startTime: new Date(event.start!.dateTime!),
              endTime: new Date(event.end!.dateTime!),
              reminders: connection.syncSettings.reminderMinutes,
              status: "synced",
              lastSyncAt: new Date(),
            });

            syncResult.eventsCreated++;
          }
        } catch (eventError) {
          console.error(`Error syncing tender ${tender.id}:`, eventError);
          // Continue with other events
        }
      }
    } catch (error) {
      console.error("Error syncing Google Calendar events:", error);
      throw error;
    }
  }

  /**
   * Sync events to Outlook Calendar (placeholder)
   */
  private async syncOutlookCalendarEvents(
    connection: CalendarConnection,
    tenders: any[],
    syncResult: CalendarSync
  ): Promise<void> {
    // Placeholder for Outlook integration
    // Would use Microsoft Graph API
    console.log("Outlook sync not yet implemented");
  }

  /**
   * Create calendar event from tender data
   */
  private createCalendarEventFromTender(
    tender: any,
    connection: CalendarConnection
  ): any {
    const closingDate = new Date(tender.closing_date);
    const eventStart = new Date(closingDate.getTime() - 60 * 60 * 1000); // 1 hour before
    const eventEnd = closingDate;

    const event = {
      summary: `${connection.syncSettings.eventPrefix}${tender.title}`,
      description: `Tender Deadline: ${tender.title}\n\nOrganization: ${tender.contracting_entity_name}\n\nDescription: ${tender.description?.substring(0, 500)}...\n\nView Details: ${tender.url || "https://mapletenders.com"}`,
      start: {
        dateTime: eventStart.toISOString(),
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: eventEnd.toISOString(),
        timeZone: "America/Toronto",
      },
      reminders: {
        useDefault: false,
        overrides: connection.syncSettings.reminderMinutes.map((minutes) => ({
          method: "email",
          minutes: minutes,
        })),
      },
      colorId: "11", // Red color for deadlines
    };

    return event;
  }

  /**
   * Refresh Google access token
   */
  private async refreshGoogleToken(
    connection: CalendarConnection
  ): Promise<void> {
    try {
      if (!connection.refreshToken || !connection.expiresAt) {
        return;
      }

      const now = new Date();
      const expiresAt = new Date(connection.expiresAt);

      // Refresh if token expires in the next 5 minutes
      if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
        this.googleOAuth2Client.setCredentials({
          refresh_token: connection.refreshToken,
        });

        const { credentials } =
          await this.googleOAuth2Client.refreshAccessToken();

        if (credentials.access_token) {
          await this.updateCalendarConnection(
            connection.id!,
            connection.userId,
            {
              accessToken: credentials.access_token,
              expiresAt: credentials.expiry_date
                ? new Date(credentials.expiry_date)
                : undefined,
            }
          );

          connection.accessToken = credentials.access_token;
          connection.expiresAt = credentials.expiry_date
            ? new Date(credentials.expiry_date)
            : undefined;
        }
      }
    } catch (error) {
      console.error("Error refreshing Google token:", error);
      throw new Error("Failed to refresh access token");
    }
  }

  /**
   * Save calendar event to database
   */
  async saveCalendarEvent(
    event: Omit<CalendarEvent, "id" | "createdAt">
  ): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .insert([
          {
            user_id: event.userId,
            tender_id: event.tenderId,
            calendar_connection_id: event.calendarConnectionId,
            external_event_id: event.externalEventId,
            title: event.title,
            description: event.description,
            start_time: event.startTime.toISOString(),
            end_time: event.endTime.toISOString(),
            location: event.location,
            url: event.url,
            reminders: event.reminders,
            status: event.status,
            last_sync_at: event.lastSyncAt?.toISOString(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToCalendarEvent(data);
    } catch (error) {
      console.error("Error saving calendar event:", error);
      throw new Error("Failed to save calendar event");
    }
  }

  /**
   * Update calendar event
   */
  async updateCalendarEvent(
    eventId: string,
    updates: Partial<CalendarEvent>
  ): Promise<CalendarEvent> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .update({
          ...updates,
          start_time: updates.startTime?.toISOString(),
          end_time: updates.endTime?.toISOString(),
          last_sync_at: updates.lastSyncAt?.toISOString(),
        })
        .eq("id", eventId)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToCalendarEvent(data);
    } catch (error) {
      console.error("Error updating calendar event:", error);
      throw new Error("Failed to update calendar event");
    }
  }

  /**
   * Get existing calendar event
   */
  async getExistingCalendarEvent(
    connectionId: string,
    tenderId: string
  ): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("calendar_connection_id", connectionId)
        .eq("tender_id", tenderId)
        .single();

      if (error || !data) return null;
      return this.mapDatabaseToCalendarEvent(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Record sync result
   */
  private async recordSyncResult(syncResult: CalendarSync): Promise<void> {
    try {
      await supabase.from("calendar_sync_log").insert([
        {
          user_id: syncResult.userId,
          provider: syncResult.provider,
          last_sync_at: syncResult.lastSyncAt.toISOString(),
          sync_status: syncResult.syncStatus,
          events_created: syncResult.eventsCreated,
          events_updated: syncResult.eventsUpdated,
          events_deleted: syncResult.eventsDeleted,
          error_message: syncResult.errorMessage,
        },
      ]);
    } catch (error) {
      console.error("Error recording sync result:", error);
    }
  }

  /**
   * Map database row to CalendarConnection object
   */
  private mapDatabaseToCalendarConnection(data: any): CalendarConnection {
    return {
      id: data.id,
      userId: data.user_id,
      provider: data.provider,
      accountEmail: data.account_email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      calendarId: data.calendar_id,
      calendarName: data.calendar_name,
      enabled: data.enabled,
      syncSettings: data.sync_settings || {
        syncDeadlines: true,
        syncBookmarked: true,
        syncSavedSearches: false,
        reminderMinutes: [60, 1440],
        eventPrefix: "[Tender] ",
      },
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Map database row to CalendarEvent object
   */
  private mapDatabaseToCalendarEvent(data: any): CalendarEvent {
    return {
      id: data.id,
      userId: data.user_id,
      tenderId: data.tender_id,
      calendarConnectionId: data.calendar_connection_id,
      externalEventId: data.external_event_id,
      title: data.title,
      description: data.description,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      location: data.location,
      url: data.url,
      reminders: data.reminders || [],
      status: data.status,
      lastSyncAt: data.last_sync_at ? new Date(data.last_sync_at) : undefined,
      createdAt: new Date(data.created_at),
    };
  }
}

export const calendarService = new CalendarService();
