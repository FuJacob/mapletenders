import { useState, useEffect, memo } from 'react';
import { Bell, Check, X } from '@phosphor-icons/react';
import { notificationsAPI } from '../../api/notifications';
import type { NotificationPreference } from '../../api/notifications';

interface NotificationPreferencesProps {
  className?: string;
}

const NotificationPreferences = memo(function NotificationPreferences({ 
  className = "" 
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const data = await notificationsAPI.getPreferences();
      
      // If no preferences exist, create defaults
      if (data.length === 0) {
        const defaultPreferences: NotificationPreference[] = [
          {
            userId: '', // Will be set by backend
            type: 'deadline_alert',
            channels: ['email', 'in_app'],
            frequency: 'instant',
            enabled: true,
          },
          {
            userId: '',
            type: 'new_tender',
            channels: ['email', 'in_app'],
            frequency: 'daily',
            enabled: true,
          },
          {
            userId: '',
            type: 'saved_search_alert',
            channels: ['email', 'in_app'],
            frequency: 'instant',
            enabled: true,
          },
          {
            userId: '',
            type: 'system_notification',
            channels: ['in_app'],
            frequency: 'instant',
            enabled: true,
          },
        ];
        setPreferences(defaultPreferences);
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      setMessage({ type: 'error', text: 'Failed to load notification preferences' });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      await notificationsAPI.updatePreferences(preferences);
      setMessage({ type: 'success', text: 'Notification preferences saved successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setMessage({ type: 'error', text: 'Failed to save notification preferences' });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (type: string, field: keyof NotificationPreference, value: any) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.type === type ? { ...pref, [field]: value } : pref
      )
    );
  };

  const toggleChannel = (type: string, channel: string) => {
    setPreferences(prev => 
      prev.map(pref => {
        if (pref.type === type) {
          const channels = pref.channels.includes(channel)
            ? pref.channels.filter(c => c !== channel)
            : [...pref.channels, channel];
          return { ...pref, channels };
        }
        return pref;
      })
    );
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'deadline_alert':
        return 'Deadline Alerts';
      case 'new_tender':
        return 'New Tender Notifications';
      case 'saved_search_alert':
        return 'Saved Search Alerts';
      case 'system_notification':
        return 'System Notifications';
      default:
        return type;
    }
  };

  const getNotificationTypeDescription = (type: string) => {
    switch (type) {
      case 'deadline_alert':
        return 'Get notified when tender deadlines are approaching';
      case 'new_tender':
        return 'Get notified about new tenders matching your interests';
      case 'saved_search_alert':
        return 'Get notified when your saved searches find new results';
      case 'system_notification':
        return 'Important system updates and announcements';
      default:
        return '';
    }
  };

  const availableChannels = [
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'sms', name: 'SMS', icon: '📱' },
    { id: 'slack', name: 'Slack', icon: '💬' },
    { id: 'teams', name: 'Teams', icon: '🔷' },
    { id: 'in_app', name: 'In-App', icon: '🔔' },
  ];

  const frequencyOptions = [
    { value: 'instant', label: 'Instant' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Summary' },
  ];

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-surface-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-surface-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text">Notification Preferences</h2>
            <p className="text-sm text-text-light">
              Control how and when you receive notifications
            </p>
          </div>
        </div>
        <button
          onClick={savePreferences}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </button>
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

      {/* Preferences */}
      <div className="space-y-6">
        {preferences.map((preference) => (
          <div key={preference.type} className="border border-border rounded-lg p-4">
            {/* Preference Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-text">
                    {getNotificationTypeLabel(preference.type)}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preference.enabled}
                      onChange={(e) => updatePreference(preference.type, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-sm text-text-light">
                  {getNotificationTypeDescription(preference.type)}
                </p>
              </div>
            </div>

            {/* Channels and Frequency */}
            {preference.enabled && (
              <div className="space-y-4">
                {/* Channels */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Notification Channels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(preference.type, channel.id)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          preference.channels.includes(channel.id)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-surface-muted text-text-light border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="mr-1">{channel.icon}</span>
                        {channel.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Frequency
                  </label>
                  <select
                    value={preference.frequency}
                    onChange={(e) => updatePreference(preference.type, 'frequency', e.target.value)}
                    className="w-full md:w-auto px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Test Notification */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-medium text-text mb-2">Test Notifications</h3>
        <p className="text-sm text-text-light mb-3">
          Send a test notification to verify your settings are working correctly.
        </p>
        <button
          onClick={async () => {
            try {
              await notificationsAPI.createTestNotification();
              setMessage({ type: 'success', text: 'Test notification sent!' });
              setTimeout(() => setMessage(null), 3000);
            } catch (error) {
              setMessage({ type: 'error', text: 'Failed to send test notification' });
            }
          }}
          className="px-4 py-2 bg-surface-muted text-text border border-border rounded-lg hover:bg-surface-muted/80 transition-colors"
        >
          Send Test Notification
        </button>
      </div>
    </div>
  );
});

export default NotificationPreferences;