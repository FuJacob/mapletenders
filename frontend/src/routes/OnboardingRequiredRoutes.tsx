import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectOnboardingCompleted,
  selectAuthLoading,
} from "../features/auth/authSelectors";
export default function OnboardingRequiredRoutes() {
  const isOnboardingCompleted = useSelector(selectOnboardingCompleted);
  const loading = useSelector(selectAuthLoading);
  if (loading) {
    // If the onboarding status is still loading, you can return a loading state or null
    return null; // or a loading spinner component
  }
  if (!isOnboardingCompleted && !loading) {
    // If onboarding is not completed, redirect to the onboarding page
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
