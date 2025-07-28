import { useState, useEffect, memo } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash, 
  Gear, 
  CheckCircle, 
  XCircle,
  Warning,
  ArrowsClockwise
} from '@phosphor-icons/react';
import { calendarAPI } from '../../api/calendar';
import type { CalendarConnection, CalendarProvider } from '../../api/calendar';
import { formatDistanceToNow } from 'date-fns';

interface CalendarConnectionsProps {
  className?: string;
  onConnectionChange?: () => void;
}

const CalendarConnections = memo(function CalendarConnections({ 
  className = "",
  onConnectionChange
}: CalendarConnectionsProps) {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<CalendarConnection | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Load connections and providers on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [connectionsData, providersData] = await Promise.all([
        calendarAPI.getConnections(),
        calendarAPI.getProviders(),
      ]);
      setConnections(connectionsData);
      setProviders(providersData);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (providerId: string) => {
    if (providerId !== 'google') {
      alert('Only Google Calendar is currently supported');
      return;
    }

    setConnecting(true);
    try {
      await calendarAPI.connectGoogle();
      await loadData();
      onConnectionChange?.();
    } catch (error) {
      console.error('Error connecting calendar:', error);
      alert('Failed to connect calendar. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this calendar? All synced events will be removed.')) {
      return;
    }

    try {
      await calendarAPI.deleteConnection(connectionId);
      await loadData();
      onConnectionChange?.();
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      alert('Failed to disconnect calendar. Please try again.');
    }
  };

  const handleToggleEnabled = async (connection: CalendarConnection) => {
    try {
      await calendarAPI.toggleConnection(connection.id, !connection.enabled);
      await loadData();
      onConnectionChange?.();
    } catch (error) {
      console.error('Error toggling calendar connection:', error);
      alert('Failed to update calendar connection. Please try again.');
    }
  };

  const handleSync = async (connectionId: string) => {
    setSyncing(connectionId);
    try {
      await calendarAPI.syncDeadlines();
      await loadData();
      alert('Calendar sync completed successfully!');
    } catch (error) {
      console.error('Error syncing calendar:', error);
      alert('Failed to sync calendar. Please try again.');
    } finally {
      setSyncing(null);
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    try {
      const result = await calendarAPI.testConnection(connectionId);
      alert(`Connection test successful!\nStatus: ${result.status}\nLast tested: ${new Date().toLocaleString()}`);
    } catch (error) {
      console.error('Error testing connection:', error);
      alert('Connection test failed. Please check your calendar settings.');
    }
  };

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

  const getConnectionStatus = (connection: CalendarConnection) => {
    if (!connection.enabled) {
      return { status: 'disabled', color: 'text-text-light', icon: XCircle };
    }
    // You could add more sophisticated status checking here
    return { status: 'connected', color: 'text-success', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className={`bg-surface border border-border rounded-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-surface-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map(i => (
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
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-text">Calendar Integration</h2>
            <p className="text-sm text-text-light">
              Sync tender deadlines with your calendar
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-text-light hover:text-text rounded-lg hover:bg-surface-muted transition-colors"
          title="Calendar Settings"
        >
          <Gear className="w-5 h-5" />
        </button>
      </div>

      {/* Connected Calendars */}
      {connections.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-text mb-3">Connected Calendars</h3>
          <div className="space-y-3">
            {connections.map((connection) => {
              const status = getConnectionStatus(connection);
              const StatusIcon = status.icon;

              return (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getProviderIcon(connection.provider)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-text capitalize">
                          {connection.provider} Calendar
                        </h4>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <p className="text-sm text-text-light">
                        {connection.accountEmail}
                      </p>
                      {connection.calendarName && (
                        <p className="text-xs text-text-light">
                          Calendar: {connection.calendarName}
                        </p>
                      )}
                      <p className="text-xs text-text-light">
                        Updated {formatDistanceToNow(connection.updatedAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Enable/Disable Toggle */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={connection.enabled}
                        onChange={() => handleToggleEnabled(connection)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>

                    {/* Sync Button */}
                    <button
                      onClick={() => handleSync(connection.id)}
                      disabled={!connection.enabled || syncing === connection.id}
                      className="p-2 text-text-light hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-surface-muted transition-colors"
                      title="Sync Now"
                    >
                      <ArrowsClockwise 
                        className={`w-4 h-4 ${syncing === connection.id ? 'animate-spin' : ''}`} 
                      />
                    </button>

                    {/* Settings Button */}
                    <button
                      onClick={() => setSelectedConnection(connection)}
                      className="p-2 text-text-light hover:text-primary rounded-lg hover:bg-surface-muted transition-colors"
                      title="Connection Settings"
                    >
                      <Gear className="w-4 h-4" />
                    </button>

                    {/* Disconnect Button */}
                    <button
                      onClick={() => handleDisconnect(connection.id)}
                      className="p-2 text-text-light hover:text-error rounded-lg hover:bg-surface-muted transition-colors"
                      title="Disconnect"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Providers */}
      <div>
        <h3 className="text-lg font-medium text-text mb-3">
          {connections.length > 0 ? 'Add More Calendars' : 'Connect Your Calendar'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => {
            const isConnected = connections.some(c => c.provider === provider.id);
            const isAvailable = provider.status === 'available';

            return (
              <div
                key={provider.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isConnected 
                    ? 'border-success/20 bg-success/5' 
                    : isAvailable
                    ? 'border-border hover:border-primary/50 cursor-pointer'
                    : 'border-border opacity-50'
                }`}
                onClick={isAvailable && !isConnected ? () => handleConnect(provider.id) : undefined}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {getProviderIcon(provider.id)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-text">{provider.name}</h4>
                      {isConnected && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                      {!isAvailable && (
                        <Warning className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <p className="text-sm text-text-light mb-2">
                      {provider.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-xs bg-surface-muted text-text-light px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    {isConnected ? (
                      <span className="text-sm text-success font-medium">
                        ✓ Connected
                      </span>
                    ) : isAvailable ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(provider.id);
                        }}
                        disabled={connecting}
                        className="flex items-center gap-2 text-sm bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connecting ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Connect
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-warning font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Settings Modal (placeholder) */}
      {selectedConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-text mb-4">
              Calendar Settings
            </h3>
            <p className="text-text-light mb-4">
              Settings for {selectedConnection.provider} Calendar
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedConnection(null)}
                className="px-4 py-2 text-text-light hover:text-text border border-border rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleTestConnection(selectedConnection.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default CalendarConnections;