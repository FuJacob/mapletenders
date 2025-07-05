import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOnboardingCompleted } from "../features/auth/authSelectors";
export default function OnboardingRequiredRoutes() {
  const isOnboardingCompleted = useSelector(selectOnboardingCompleted);
  if (!isOnboardingCompleted) {
    // If onboarding is not completed, redirect to the onboarding page
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
