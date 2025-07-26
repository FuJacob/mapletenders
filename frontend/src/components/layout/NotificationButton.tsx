import { Bell } from "@phosphor-icons/react";

interface NotificationButtonProps {
  hasNotifications?: boolean;
  onClick?: () => void;
}

export default function NotificationButton({
  hasNotifications = true,
  onClick,
}: NotificationButtonProps) {
  return (
    <button
      className="p-2 text-text-light hover:text-primary transition-colors relative"
      aria-label="Notifications"
      onClick={onClick}
    >
      <Bell className="w-5 h-5" />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-lg"></span>
      )}
    </button>
  );
}
