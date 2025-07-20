import moment from "moment";
import type { BookmarkWithTender } from "../api/bookmarks";
import type { TenderDisplayData } from "../types/tender";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: "urgent" | "warning" | "normal";
  allDay?: boolean;
  // Additional tender data for event details
  tender: {
    id: string;
    title: string;
    closing_date: string | null;
    contracting_entity_name: string | null;
    contracting_entity_city: string | null;
    contracting_entity_province: string | null;
    procurement_type: string | null;
    source_url: string | null;
    source_reference: string | null;
    category_primary: string | null;
    delivery_location: string | null;
    description: string | null;
  };
}

/**
 * Calculate the urgency level based on days until closing
 */
export const calculateUrgency = (closingDate: string | null): "urgent" | "warning" | "normal" => {
  if (!closingDate) return "normal";
  
  const now = moment();
  const closing = moment(closingDate);
  const daysUntilClosing = closing.diff(now, 'days');
  
  if (daysUntilClosing <= 3) return "urgent";
  if (daysUntilClosing <= 7) return "warning";
  return "normal";
};

/**
 * Format event title for calendar display
 */
export const formatEventTitle = (tender: TenderDisplayData): string => {
  const title = tender.title || "Untitled Tender";
  const entityName = tender.contracting_entity_name;
  
  if (entityName && title.length + entityName.length <= 50) {
    return `${title} - ${entityName}`;
  }
  
  // Truncate title if too long
  return title.length > 40 ? `${title.substring(0, 37)}...` : title;
};

/**
 * Get event timing based on closing date
 */
export const getEventTiming = (closingDate: string | null): { start: Date; end: Date; allDay: boolean } => {
  if (!closingDate) {
    // If no closing date, create an all-day event for today
    const today = new Date();
    return {
      start: moment(today).startOf('day').toDate(),
      end: moment(today).endOf('day').toDate(),
      allDay: true
    };
  }
  
  const closing = moment(closingDate);
  
  // If the closing date has time info, preserve it
  if (closing.hour() !== 0 || closing.minute() !== 0) {
    return {
      start: closing.toDate(),
      end: closing.add(1, 'hour').toDate(), // 1-hour event
      allDay: false
    };
  }
  
  // For date-only closing times, make it an all-day event
  return {
    start: closing.startOf('day').toDate(),
    end: closing.endOf('day').toDate(),
    allDay: true
  };
};

/**
 * Transform a single bookmark into a calendar event
 */
export const transformBookmarkToEvent = (bookmark: BookmarkWithTender): CalendarEvent | null => {
  const tender = bookmark.tender_notice;
  
  // Skip if no closing date
  if (!tender.closing_date) {
    return null;
  }
  
  const timing = getEventTiming(tender.closing_date);
  const urgency = calculateUrgency(tender.closing_date);
  const title = formatEventTitle(tender);
  
  return {
    id: `bookmark-${bookmark.id}-${tender.id}`,
    title,
    start: timing.start,
    end: timing.end,
    allDay: timing.allDay,
    resource: urgency,
    tender: {
      id: tender.id,
      title: tender.title,
      closing_date: tender.closing_date,
      contracting_entity_name: tender.contracting_entity_name,
      contracting_entity_city: tender.contracting_entity_city,
      contracting_entity_province: tender.contracting_entity_province,
      procurement_type: tender.procurement_type,
      source_url: tender.source_url,
      source_reference: tender.source_reference,
      category_primary: tender.category_primary,
      delivery_location: tender.delivery_location,
      description: tender.description,
    }
  };
};

/**
 * Transform multiple bookmarks into calendar events
 */
export const transformBookmarksToEvents = (bookmarks: BookmarkWithTender[]): CalendarEvent[] => {
  return bookmarks
    .map(transformBookmarkToEvent)
    .filter((event): event is CalendarEvent => event !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
};

/**
 * Filter events by date range for performance
 */
export const filterEventsByDateRange = (
  events: CalendarEvent[], 
  startDate: Date, 
  endDate: Date
): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = moment(event.start);
    const eventEnd = moment(event.end);
    const rangeStart = moment(startDate);
    const rangeEnd = moment(endDate);
    
    // Event overlaps with the date range
    return eventStart.isBefore(rangeEnd) && eventEnd.isAfter(rangeStart);
  });
};

/**
 * Get event color styling based on urgency
 */
export const getEventStyle = (urgency: "urgent" | "warning" | "normal") => {
  switch (urgency) {
    case "urgent":
      return {
        backgroundColor: "var(--color-error)",
        borderColor: "var(--color-error)",
        color: "white"
      };
    case "warning":
      return {
        backgroundColor: "var(--color-warning)",
        borderColor: "var(--color-warning)",
        color: "white"
      };
    default:
      return {
        backgroundColor: "var(--color-primary)",
        borderColor: "var(--color-primary)",
        color: "white"
      };
  }
};

/**
 * Format tender location for display
 */
export const formatTenderLocation = (tender: CalendarEvent['tender']): string => {
  const parts = [
    tender.contracting_entity_city,
    tender.contracting_entity_province
  ].filter(Boolean);
  
  if (parts.length > 0) {
    return parts.join(", ");
  }
  
  return tender.delivery_location || "Location not specified";
};

/**
 * Format closing date for display
 */
export const formatClosingDate = (closingDate: string | null): string => {
  if (!closingDate) return "No closing date";
  
  const closing = moment(closingDate);
  const now = moment();
  
  if (closing.isSame(now, 'day')) {
    return `Today at ${closing.format('h:mm A')}`;
  }
  
  if (closing.isSame(now.clone().add(1, 'day'), 'day')) {
    return `Tomorrow at ${closing.format('h:mm A')}`;
  }
  
  const daysUntil = closing.diff(now, 'days');
  if (daysUntil > 0 && daysUntil <= 7) {
    return `In ${daysUntil} days (${closing.format('MMM D, h:mm A')})`;
  }
  
  return closing.format('MMM D, YYYY [at] h:mm A');
};

/**
 * Get urgency label and color
 */
export const getUrgencyInfo = (urgency: "urgent" | "warning" | "normal") => {
  switch (urgency) {
    case "urgent":
      return { label: "Due Soon", color: "text-error", bg: "bg-error/10" };
    case "warning":
      return { label: "Due This Week", color: "text-warning", bg: "bg-warning/10" };
    default:
      return { label: "Upcoming", color: "text-primary", bg: "bg-primary/10" };
  }
};