import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectOnboardingCompleted,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isOnboardingCompleted = useSelector(selectOnboardingCompleted);
  const loading = useSelector(selectAuthLoading);
  // If user is authenticated, redirect to home
  if (loading) {
    // If the session is still loading, you can return a loading state or null
    return <LoadingSpinner />; // or a loading spinner component
  }
  if (isAuthenticated) {
    if (!isOnboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    console.log("User is authenticated, redirecting to home");
    return <Navigate to="/home" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
