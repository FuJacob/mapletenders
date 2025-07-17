import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css";

const localizer = momentLocalizer(moment);
const CalendarPage = () => (
  <div>
    <Calendar
      localizer={localizer}
      events={[]}
      defaultDate={new Date()}
      defaultView="month"
      style={{ height: "50vh" }}
    />
  </div>
);

export default CalendarPage;
