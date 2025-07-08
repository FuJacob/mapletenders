import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSelectors";

export function useAuth() {
  const user = useSelector(selectAuthUser);
  return { user };
}
