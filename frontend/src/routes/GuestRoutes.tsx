import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectAuthSession,
  selectOnboardingCompleted,
} from "../features/auth/authSelectors";

export default function GuestRoute() {
  const session = useSelector(selectAuthSession);
  const isOnboardingCompleted = useSelector(selectOnboardingCompleted);
  // If user is authenticated, redirect to home
  if (session) {
    if (!isOnboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
