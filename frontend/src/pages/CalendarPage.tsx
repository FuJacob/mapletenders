import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  momentLocalizer,
  type View,
  type Event,
  type SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/calendar.css";
import {
  Calendar as CalendarIcon,
  FunnelSimple,
  CaretLeftIcon,
  CaretRightIcon,
  CalendarDotIcon,
} from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";
import { useAuth } from "../hooks/auth";
import { getUserBookmarks, removeBookmark } from "../api/bookmarks";
// Import BookmarkWithTender for API responses (used in loadBookmarks function)
import {
  transformBookmarksToEvents,
  getEventStyle,
  type CalendarEvent,
} from "../utils/calendarHelpers";
import TenderEventModal from "../components/calendar/TenderEventModal";
import CalendarLoadingState from "../components/calendar/CalendarLoadingState";
import CalendarEmptyState from "../components/calendar/CalendarEmptyState";

const localizer = momentLocalizer(moment);

type UrgencyFilter = "all" | "urgent" | "warning" | "normal";

export default function CalendarPage() {
  const { user } = useAuth();

  // Component state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");

  // Data state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load bookmarks and transform to events
  const loadBookmarks = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getUserBookmarks(user.id);
      if (response.error) {
        setError(response.error);
        return;
      }

      const calendarEvents = transformBookmarksToEvents(response.bookmarks);
      setEvents(calendarEvents);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
      setError("Failed to load bookmarked tenders");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load data on mount and user change
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Filter events based on urgency
  const filteredEvents = events.filter((event) => {
    if (urgencyFilter === "all") return true;
    return event.resource === urgencyFilter;
  });

  // Event handlers
  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleSelectEvent = (event: Event) => {
    const calendarEvent = event as CalendarEvent;
    setSelectedEvent(calendarEvent);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Could be used to create new events in the future
    console.log("Selected slot:", slotInfo);
  };

  const handleToggleBookmark = async (
    tenderId: string,
    isCurrentlyBookmarked: boolean
  ) => {
    if (!user?.id || !isCurrentlyBookmarked) return;

    try {
      await removeBookmark(user.id, tenderId);
      // Refresh the calendar data
      await loadBookmarks();
      // Close modal if the event was removed
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <PageHeader
          icon={<CalendarIcon className="w-10 h-10 text-primary" />}
          title="Calendar"
          description="Track important dates, deadlines, and procurement events"
        />
        <CalendarLoadingState />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <PageHeader
          icon={<CalendarIcon className="w-10 h-10 text-primary" />}
          title="Calendar"
          description="Track important dates, deadlines, and procurement events"
        />
        <div className="bg-surface rounded-lg border border-border shadow-sm p-8 text-center">
          <div className="text-error mb-4">⚠️ Error loading calendar</div>
          <p className="text-text-muted mb-4">{error}</p>
          <button
            onClick={loadBookmarks}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  // Show empty state
  if (events.length === 0) {
    return (
      <>
        <PageHeader
          icon={<CalendarIcon className="w-10 h-10 text-primary" />}
          title="Calendar"
          description="Track important dates, deadlines, and procurement events"
        />
        <CalendarEmptyState />
      </>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          icon={<CalendarIcon className="w-10 h-10 text-primary" />}
          title="Calendar"
          description={`Track important dates, deadlines, and procurement events (${
            events.length
          } deadline${events.length !== 1 ? "s" : ""})`}
        />

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelSimple className="w-5 h-5 text-text-light" />
            <span className="text-sm font-medium text-text">
              Filter by urgency:
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All Events", count: events.length },
              {
                value: "urgent",
                label: "Due Soon",
                count: events.filter((e) => e.resource === "urgent").length,
              },
              {
                value: "warning",
                label: "This Week",
                count: events.filter((e) => e.resource === "warning").length,
              },
              {
                value: "normal",
                label: "Upcoming",
                count: events.filter((e) => e.resource === "normal").length,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setUrgencyFilter(filter.value as UrgencyFilter)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  urgencyFilter === filter.value
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-text-muted hover:bg-border"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 bg-surface rounded-lg border border-border shadow-sm min-h-0">
        <Calendar
          className="custom-calendar"
          localizer={localizer}
          events={filteredEvents}
          date={currentDate}
          view={currentView}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          style={{ height: "100%" }}
          views={["month", "week", "agenda"]}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          components={{
            toolbar: ({ label, onNavigate, onView, view }) => (
              <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border bg-surface">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <button
                    onClick={() => onNavigate("PREV")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text bg-background border border-border rounded-lg hover:bg-border transition-colors"
                  >
                    <CaretLeftIcon className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => onNavigate("TODAY")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <CalendarDotIcon className="w-4 h-4" /> Today
                  </button>
                  <button
                    onClick={() => onNavigate("NEXT")}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text bg-background border border-border rounded-lg hover:bg-border transition-colors"
                  >
                    <CaretRightIcon className="w-4 h-4" /> Next
                  </button>
                </div>

                <h2 className="text-2xl font-bold text-text mb-4 sm:mb-0">
                  {label}
                </h2>

                <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
                  {["month", "week", "agenda"].map((viewName) => (
                    <button
                      key={viewName}
                      onClick={() => onView(viewName as View)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                        view === viewName
                          ? "bg-primary text-white"
                          : "text-text hover:bg-border"
                      }`}
                    >
                      {viewName}
                    </button>
                  ))}
                </div>
              </div>
            ),
          }}
          eventPropGetter={(event) => {
            const calendarEvent = event as CalendarEvent;
            return {
              style: getEventStyle(calendarEvent.resource),
            };
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 mt-6 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-error rounded"></div>
          <span className="text-sm text-text">Due Soon (≤3 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-warning rounded"></div>
          <span className="text-sm text-text">Due This Week (≤7 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded"></div>
          <span className="text-sm text-text">Upcoming (&gt;7 days)</span>
        </div>
      </div>

      {/* Event Detail Modal */}
      <TenderEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggleBookmark={handleToggleBookmark}
        isBookmarked={true}
      />
    </div>
  );
}
