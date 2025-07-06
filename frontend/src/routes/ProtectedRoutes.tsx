import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {
  selectAuthSession,
  selectAuthLoading,
} from "../features/auth/authSelectors";
export default function ProtectedRoutes() {
  const session = useSelector(selectAuthSession);
  const loading = useSelector(selectAuthLoading);
  
  if (loading) {
    // If the session is still loading, you can return a loading state or null
    return null; // or a loading spinner component
  }
  if (!session && !loading) {
    console.log("User is not authenticated, redirecting to sign-in");
    // If user is not authenticated, redirect to home
    return <Navigate to="/sign-in" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
