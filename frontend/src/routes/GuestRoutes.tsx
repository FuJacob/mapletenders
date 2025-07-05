import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuthSession } from "../features/auth/authSelectors";

export default function GuestRoute() {
  const session = useSelector(selectAuthSession);

  // If user is authenticated, redirect to dashboard
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
