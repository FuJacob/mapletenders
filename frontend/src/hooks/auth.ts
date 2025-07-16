import { useSelector } from "react-redux";
import { 
  selectAuthUser, 
  selectAuthProfile, 
  selectCombinedUser,
  selectIsAuthenticated 
} from "../features/auth/authSelectors";

export function useAuth() {
  const user = useSelector(selectAuthUser); // Supabase user
  const profile = useSelector(selectAuthProfile); // Profile data
  const combinedUser = useSelector(selectCombinedUser); // Combined object
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  return { 
    user, 
    profile, 
    combinedUser, 
    isAuthenticated 
  };
}
