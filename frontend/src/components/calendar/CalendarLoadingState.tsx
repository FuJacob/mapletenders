import LoadingSpinner from "../common/LoadingSpinner";

export default function CalendarLoadingState() {
  return (
    <LoadingSpinner 
      variant="calendar" 
      message="Fetching your bookmarked tender deadlines..." 
    />
  );
}
