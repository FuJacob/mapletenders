import { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  type View,
  type Event,
  type SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar as CalendarIcon } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";

const localizer = momentLocalizer(moment);

// Sample events for demonstration
const sampleEvents = [
  {
    id: 1,
    title: "Tender Submission Due",
    start: new Date(2024, 6, 15, 9, 0),
    end: new Date(2024, 6, 15, 17, 0),
    resource: "high",
  },
  {
    id: 2,
    title: "RFP Review Meeting",
    start: new Date(2024, 6, 18, 14, 0),
    end: new Date(2024, 6, 18, 16, 0),
    resource: "medium",
  },
  {
    id: 3,
    title: "Procurement Conference",
    start: new Date(2024, 6, 22, 9, 0),
    end: new Date(2024, 6, 24, 17, 0),
    resource: "low",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [events] = useState(sampleEvents);

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleSelectEvent = (event: Event) => {
    alert(`Selected event: ${event.title}`);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const title = window.prompt("New Event name");
    if (title) {
      console.log("New event:", {
        title,
        start: slotInfo.start,
        end: slotInfo.end,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeader
          icon={<CalendarIcon className="w-10 h-10 text-primary" />}
          title="Calendar"
          description="Track important dates, deadlines, and procurement events"
        />

        {/* Calendar Container */}
        <div className="bg-surface rounded-lg border border-border shadow-sm">
          <Calendar
            className="custom-calendar"
            localizer={localizer}
            events={events}
            date={currentDate}
            view={currentView}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}
            views={["month", "week", "day", "agenda"]}
            step={60}
            showMultiDayTimes
            defaultDate={new Date()}
            components={{
              toolbar: ({ label, onNavigate, onView, view }) => (
                <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border bg-surface">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <button
                      onClick={() => onNavigate("PREV")}
                      className="px-4 py-2 text-sm font-medium text-text bg-background border border-border rounded-lg hover:bg-border transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => onNavigate("TODAY")}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => onNavigate("NEXT")}
                      className="px-4 py-2 text-sm font-medium text-text bg-background border border-border rounded-lg hover:bg-border transition-colors"
                    >
                      Next
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-text mb-4 sm:mb-0">
                    {label}
                  </h2>

                  <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
                    {["month", "week", "day", "agenda"].map((viewName) => (
                      <button
                        key={viewName}
                        onClick={() => onView(viewName as View)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
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
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.resource === "high"
                    ? "var(--color-error)"
                    : event.resource === "medium"
                    ? "var(--color-warning)"
                    : "var(--color-success)",
                borderColor:
                  event.resource === "high"
                    ? "var(--color-error)"
                    : event.resource === "medium"
                    ? "var(--color-warning)"
                    : "var(--color-success)",
              },
            })}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-error rounded"></div>
            <span className="text-sm text-text">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span className="text-sm text-text">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-sm text-text">Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
