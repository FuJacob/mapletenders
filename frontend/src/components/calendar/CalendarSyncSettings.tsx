import { useState, useEffect, memo } from 'react';
import { 
  Calendar, 
  Bell, 
  BookmarkSimple,
  MagnifyingGlass,
  Check
} from '@phosphor-icons/react';
import { calendarAPI } from '../../api/calendar';
import type { CalendarConnection } from '../../api/calendar';

interface CalendarSyncSettingsProps {
  className?: string;
}

const CalendarSyncSettings = memo(function CalendarSyncSettings({ 
  className = "" 
}: CalendarSyncSettingsProps) {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load connections on mount
  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const data = await calendarAPI.getConnections();
      setConnections(data.filter(c => c.enabled)); // Only show enabled connections
    } catch (error) {
      console.error('Error loading calendar connections:', error);
      setMessage({ type: 'error', text: 'Failed to load calendar connections' });
    } finally {
      setLoading(false);
    }
  };

  const updateSyncSettings = async (
    connectionId: string, 
    settings: CalendarConnection['syncSettings']
  ) => {
    setSaving(connectionId);
    try {
      await calendarAPI.updateSyncSettings(connectionId, settings);
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, syncSettings: settings }
            : conn
        )
      );
      setMessage({ type: 'success', text: 'Sync settings updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating sync settings:', error);
      setMessage({ type: 'error', text: 'Failed to update sync settings' });
    } finally {
      setSaving(null);
    }
  };

  const handleSettingChange = (
    connection: CalendarConnection,
    field: keyof CalendarConnection['syncSettings'],
    value: any
  ) => {
    const newSettings = { ...connection.syncSettings, [field]: value };
    updateSyncSettings(connection.id, newSettings);
  };

  const handleReminderChange = (
    connection: CalendarConnection,
    minutes: number,
    checked: boolean
  ) => {
    const currentReminders = connection.syncSettings.reminderMinutes;
    const newReminders = checked
      ? [...currentReminders, minutes].sort((a, b) => a - b)
      : currentReminders.filter(m => m !== minutes);
    
    const newSettings = { ...connection.syncSettings, reminderMinutes: newReminders };
    updateSyncSettings(connection.id, newSettings);
  };

  const reminderOptions = [
    { minutes: 15, label: '15 minutes before' },
    { minutes: 30, label: '30 minutes before' },
    { minutes: 60, label: '1 hour before' },
    { minutes: 120, label: '2 hours before' },
    { minutes: 480, label: '8 hours before' },
    { minutes: 1440, label: '1 day before' },
    { minutes: 2880, label: '2 days before' },
    { minutes: 10080, label: '1 week before' },
  ];

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return '📅';
      case 'outlook':
        return '📧';
      case 'apple':
        return '🍎';
      default:
        return '📅';
    }
  };

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-surface-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i}>
                <div className="h-5 bg-surface-muted rounded w-1/4 mb-3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                  <div className="h-4 bg-surface-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-text-light mx-auto mb-3" />
          <h3 className="text-lg font-medium text-text mb-2">No Calendar Connections</h3>
          <p className="text-text-light">
            Connect a calendar first to configure sync settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-text">Calendar Sync Settings</h2>
          <p className="text-sm text-text-light">
            Configure what gets synced to your calendars and when
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-success/10 text-success border border-success/20' 
            : 'bg-error/10 text-error border border-error/20'
        }`}>
          {message.text}
        </div>
      )}

      {/* Settings for each connection */}
      <div className="space-y-8">
        {connections.map((connection) => (
          <div key={connection.id} className="border border-border rounded-lg p-6">
            {/* Connection Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">
                {getProviderIcon(connection.provider)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-text capitalize">
                  {connection.provider} Calendar
                </h3>
                <p className="text-sm text-text-light">
                  {connection.accountEmail}
                </p>
              </div>
              {saving === connection.id && (
                <div className="ml-auto flex items-center gap-2 text-text-light">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Saving...</span>
                </div>
              )}
            </div>

            {/* Sync Options */}
            <div className="space-y-6">
              {/* What to Sync */}
              <div>
                <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                  <BookmarkSimple className="w-4 h-4" />
                  What to Sync
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={connection.syncSettings.syncDeadlines}
                      onChange={(e) => handleSettingChange(connection, 'syncDeadlines', e.target.checked)}
                      className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
                    />
                    <div>
                      <span className="text-text font-medium">Tender Deadlines</span>
                      <p className="text-sm text-text-light">
                        Sync closing dates for all open tenders
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={connection.syncSettings.syncBookmarked}
                      onChange={(e) => handleSettingChange(connection, 'syncBookmarked', e.target.checked)}
                      className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
                    />
                    <div>
                      <span className="text-text font-medium">Bookmarked Tenders Only</span>
                      <p className="text-sm text-text-light">
                        Only sync deadlines for tenders you've bookmarked
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={connection.syncSettings.syncSavedSearches}
                      onChange={(e) => handleSettingChange(connection, 'syncSavedSearches', e.target.checked)}
                      className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
                    />
                    <div>
                      <span className="text-text font-medium">Saved Search Results</span>
                      <p className="text-sm text-text-light">
                        Sync deadlines for tenders matching your saved searches
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Event Prefix */}
              <div>
                <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                  <MagnifyingGlass className="w-4 h-4" />
                  Event Title Prefix
                </h4>
                <input
                  type="text"
                  value={connection.syncSettings.eventPrefix}
                  onChange={(e) => handleSettingChange(connection, 'eventPrefix', e.target.value)}
                  placeholder="e.g., [Tender] "
                  className="w-full md:w-1/3 px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-sm text-text-light mt-1">
                  Text to add before each tender title in your calendar
                </p>
              </div>

              {/* Reminders */}
              <div>
                <h4 className="font-medium text-text mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Reminder Times
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {reminderOptions.map((option) => (
                    <label key={option.minutes} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={connection.syncSettings.reminderMinutes.includes(option.minutes)}
                        onChange={(e) => handleReminderChange(connection, option.minutes, e.target.checked)}
                        className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20"
                      />
                      <span className="text-sm text-text">{option.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-text-light mt-2">
                  Choose when you want to be reminded about tender deadlines
                </p>
              </div>

              {/* Sync Status */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Settings Auto-Saved</span>
                  </div>
                  <div className="text-sm text-text-light">
                    Last updated: {connection.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="mt-8 p-4 bg-info/10 border border-info/20 rounded-lg">
        <h4 className="font-medium text-info mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-info space-y-1">
          <li>• Enable "Bookmarked Tenders Only" to reduce calendar clutter</li>
          <li>• Set multiple reminders for important deadlines</li>
          <li>• Use a clear event prefix to easily identify tender deadlines</li>
          <li>• Sync will run automatically every hour to keep your calendar updated</li>
        </ul>
      </div>
    </div>
  );
});

export default CalendarSyncSettings;