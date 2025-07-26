import { useAuth } from "../../hooks/auth";
import AuthenticatedHeader from "./AuthenticatedHeader";
import GuestHeader from "./GuestHeader";

interface HeaderProps {
  className?: string;
}

export default function Header({ className = "" }: HeaderProps) {
  const { user, profile, isAuthenticated } = useAuth();

  if (!user || !profile) {
    return <GuestHeader />;
  }
  if (isAuthenticated) {
    return (
      <AuthenticatedHeader
        className={className}
        user={user}
        profile={profile}
      />
    );
  }
}
