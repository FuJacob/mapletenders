import { Plus, MagnifyingGlass, Bell, Clock } from "@phosphor-icons/react";

export default function QuickActionsSidebar() {
  const quickActions = [
    {
      icon: <Plus className="w-5 h-5 text-primary" />,
      label: "Set up Alert",
      onClick: () => console.log("Set up alert"),
    },
    {
      icon: <MagnifyingGlass className="w-5 h-5 text-info" />,
      label: "Advanced Search",
      onClick: () => console.log("Advanced search"),
    },
    {
      icon: <Bell className="w-5 h-5 text-warning" />,
      label: "Manage Alerts",
      onClick: () => console.log("Manage alerts"),
    },
    {
      icon: <Clock className="w-5 h-5 text-error" />,
      label: "Track Deadlines",
      onClick: () => console.log("Track deadlines"),
    },
  ];

  return (
    <div className="space-y-3">
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="w-full flex items-center gap-3 p-4 bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
        >
          {action.icon}
          <span className="text-text font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}