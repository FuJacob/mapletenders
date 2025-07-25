import { Star, Robot, ClockCounterClockwise } from "@phosphor-icons/react";

export type ViewMode = "recommended" | "history" | "chat";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  const toggleOptions = [
    {
      id: "recommended" as const,
      label: "Recommended for You",
      icon: <Star className="w-4 h-4" />,
    },
    {
      id: "chat" as const,
      label: "Breeze Chat",
      icon: <Robot className="w-4 h-4" />,
    },
    {
      id: "history" as const,
      label: "Recent Activity",
      icon: <ClockCounterClockwise className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {toggleOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onViewModeChange(option.id)}
          className={`px-4 py-2 rounded-x-lg rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
            viewMode === option.id
              ? "bg-surface text-text border-border border-t-1 border-x-1"
              : "border-t-1 border-border border-x-1  text-text-light hover:bg-primary/5"
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
