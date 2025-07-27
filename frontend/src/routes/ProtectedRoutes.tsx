import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { refreshTenders } from "../api";
import { useEffect } from "react";
export default function ProtectedRoutes() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    refreshTenders();
  }, []);

  if (loading) {
    // If the session is still loading, you can return a loading state or null
    return null; // or a loading spinner component
  }
  if (!isAuthenticated && !loading) {
    console.log("User is not authenticated, redirecting to sign-in");
    // If user is not authenticated, redirect to home
    return <Navigate to="/sign-in" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
