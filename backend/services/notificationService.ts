import { DatabaseService } from "./databaseService";

const databaseService = new DatabaseService();
const supabase = (databaseService as any).supabase;

export interface NotificationChannel {
  id: string;
  type: "email" | "sms" | "slack" | "teams" | "in_app";
  name: string;
  settings: Record<string, any>;
  enabled: boolean;
}

export interface NotificationPreference {
  id?: string;
  userId: string;
  type:
    | "deadline_alert"
    | "new_tender"
    | "saved_search_alert"
    | "system_notification";
  channels: string[]; // Channel IDs
  frequency: "instant" | "daily" | "weekly";
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface Notification {
  id?: string;
  userId: string;
  type:
    | "deadline_alert"
    | "new_tender"
    | "saved_search_alert"
    | "system_notification";
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  channels: string[];
  scheduledFor?: Date;
  sentAt?: Date;
  createdAt?: Date;
}

export interface DeadlineAlert {
  id?: string;
  userId: string;
  tenderId: string;
  alertType: "closing_soon" | "closing_today" | "closing_overdue";
  closingDate: Date;
  alertDate: Date;
  sent: boolean;
  channels: string[];
}

export class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(
    notification: Omit<Notification, "id" | "createdAt">
  ): Promise<Notification> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert([
          {
            user_id: notification.userId,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data || {},
            read: notification.read,
            channels: notification.channels,
            scheduled_for: notification.scheduledFor?.toISOString(),
            sent_at: notification.sentAt?.toISOString(),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToNotification(data);
    } catch (error) {
      console.error("Error creating notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  /**
   * Get notifications for a user
   */
  async getNotifications(
    userId: string,
    limit = 50,
    offset = 0,
    unreadOnly = false
  ): Promise<Notification[]> {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId);

      if (unreadOnly) {
        query = query.eq("read", false);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return (data || []).map(this.mapDatabaseToNotification);
    } catch (error) {
      console.error("Error getting notifications:", error);
      throw new Error("Failed to get notifications");
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read");
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error("Failed to mark all notifications as read");
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw new Error("Failed to delete notification");
    }
  }

  /**
   * Get notification preferences for a user
   */
  async getNotificationPreferences(
    userId: string
  ): Promise<NotificationPreference[]> {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;
      return (data || []).map(this.mapDatabaseToNotificationPreference);
    } catch (error) {
      console.error("Error getting notification preferences:", error);
      throw new Error("Failed to get notification preferences");
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: NotificationPreference[]
  ): Promise<void> {
    try {
      // Delete existing preferences
      await supabase
        .from("notification_preferences")
        .delete()
        .eq("user_id", userId);

      // Insert new preferences
      const insertData = preferences.map((pref) => ({
        user_id: userId,
        type: pref.type,
        channels: pref.channels,
        frequency: pref.frequency,
        enabled: pref.enabled,
        settings: pref.settings || {},
      }));

      const { error } = await supabase
        .from("notification_preferences")
        .insert(insertData);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      throw new Error("Failed to update notification preferences");
    }
  }

  /**
   * Create deadline alerts for upcoming tender closures
   */
  async createDeadlineAlerts(): Promise<void> {
    try {
      // Get tenders closing in the next 7 days
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const { data: tenders, error: tendersError } = await supabase
        .from("tenders")
        .select("id, title, closing_date, contracting_entity_name")
        .eq("status", "open")
        .gte("closing_date", new Date().toISOString())
        .lte("closing_date", sevenDaysFromNow.toISOString());

      if (tendersError) throw tendersError;

      // Get users who have bookmarked these tenders or have relevant saved searches
      for (const tender of tenders || []) {
        const closingDate = new Date(tender.closing_date);
        const now = new Date();
        const daysUntilClosing = Math.ceil(
          (closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        let alertType: "closing_soon" | "closing_today" | "closing_overdue";
        if (daysUntilClosing <= 0) {
          alertType = "closing_overdue";
        } else if (daysUntilClosing <= 1) {
          alertType = "closing_today";
        } else {
          alertType = "closing_soon";
        }

        // Get users who bookmarked this tender
        const { data: bookmarks } = await supabase
          .from("bookmarks")
          .select("user_id")
          .eq("tender_notice_id", tender.id);

        // Create deadline alerts for each user
        for (const bookmark of bookmarks || []) {
          await this.createDeadlineAlert({
            userId: bookmark.user_id,
            tenderId: tender.id,
            alertType,
            closingDate,
            alertDate: new Date(),
            sent: false,
            channels: ["email", "in_app"],
          });
        }
      }
    } catch (error) {
      console.error("Error creating deadline alerts:", error);
      throw new Error("Failed to create deadline alerts");
    }
  }

  /**
   * Create a deadline alert
   */
  async createDeadlineAlert(
    alert: Omit<DeadlineAlert, "id">
  ): Promise<DeadlineAlert> {
    try {
      const { data, error } = await supabase
        .from("deadline_alerts")
        .insert([
          {
            user_id: alert.userId,
            tender_id: alert.tenderId,
            alert_type: alert.alertType,
            closing_date: alert.closingDate.toISOString(),
            alert_date: alert.alertDate.toISOString(),
            sent: alert.sent,
            channels: alert.channels,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToDeadlineAlert(data);
    } catch (error) {
      console.error("Error creating deadline alert:", error);
      throw new Error("Failed to create deadline alert");
    }
  }

  /**
   * Send pending notifications
   */
  async sendPendingNotifications(): Promise<void> {
    try {
      // Get notifications that need to be sent
      const { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .is("sent_at", null)
        .or(
          "scheduled_for.is.null,scheduled_for.lte." + new Date().toISOString()
        );

      if (error) throw error;

      for (const notification of notifications || []) {
        await this.sendNotification(
          this.mapDatabaseToNotification(notification)
        );
      }
    } catch (error) {
      console.error("Error sending pending notifications:", error);
    }
  }

  /**
   * Send a notification through configured channels
   */
  private async sendNotification(notification: Notification): Promise<void> {
    try {
      // For now, we'll just log the notification
      // In a real implementation, you would integrate with email, SMS, Slack, etc.
      console.log("Sending notification:", {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        channels: notification.channels,
        userId: notification.userId,
      });

      // Mark as sent
      await supabase
        .from("notifications")
        .update({ sent_at: new Date().toISOString() })
        .eq("id", notification.id);

      // Here you would implement the actual sending logic:

      // Email sending (using SendGrid, Nodemailer, etc.)
      if (notification.channels.includes("email")) {
        await this.sendEmailNotification(notification);
      }

      // SMS sending (using Twilio, etc.)
      if (notification.channels.includes("sms")) {
        await this.sendSMSNotification(notification);
      }

      // Slack sending
      if (notification.channels.includes("slack")) {
        await this.sendSlackNotification(notification);
      }

      // Teams sending
      if (notification.channels.includes("teams")) {
        await this.sendTeamsNotification(notification);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  /**
   * Send email notification (placeholder)
   */
  private async sendEmailNotification(
    notification: Notification
  ): Promise<void> {
    // Implement email sending logic here
    console.log("Email notification sent:", notification.title);
  }

  /**
   * Send SMS notification (placeholder)
   */
  private async sendSMSNotification(notification: Notification): Promise<void> {
    // Implement SMS sending logic here
    console.log("SMS notification sent:", notification.title);
  }

  /**
   * Send Slack notification (placeholder)
   */
  private async sendSlackNotification(
    notification: Notification
  ): Promise<void> {
    // Implement Slack webhook logic here
    console.log("Slack notification sent:", notification.title);
  }

  /**
   * Send Teams notification (placeholder)
   */
  private async sendTeamsNotification(
    notification: Notification
  ): Promise<void> {
    // Implement Teams webhook logic here
    console.log("Teams notification sent:", notification.title);
  }

  /**
   * Map database row to Notification object
   */
  private mapDatabaseToNotification(data: any): Notification {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {},
      read: data.read,
      channels: data.channels || [],
      scheduledFor: data.scheduled_for
        ? new Date(data.scheduled_for)
        : undefined,
      sentAt: data.sent_at ? new Date(data.sent_at) : undefined,
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Map database row to NotificationPreference object
   */
  private mapDatabaseToNotificationPreference(
    data: any
  ): NotificationPreference {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      channels: data.channels || [],
      frequency: data.frequency,
      enabled: data.enabled,
      settings: data.settings || {},
    };
  }

  /**
   * Map database row to DeadlineAlert object
   */
  private mapDatabaseToDeadlineAlert(data: any): DeadlineAlert {
    return {
      id: data.id,
      userId: data.user_id,
      tenderId: data.tender_id,
      alertType: data.alert_type,
      closingDate: new Date(data.closing_date),
      alertDate: new Date(data.alert_date),
      sent: data.sent,
      channels: data.channels || [],
    };
  }
}

export const notificationService = new NotificationService();
