import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectAuthSession } from "../features/auth/authSelectors";
export default function ProtectedRoutes() {
  const session = useSelector(selectAuthSession);
  // If user is not authenticated, redirect to home
  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  // Otherwise, render the child components
  return <Outlet />;
}
