import { Eye } from "@phosphor-icons/react";
import type { Activity } from "./types.tsx";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-border rounded-lg">
          <Eye className="w-4 h-4 text-text-light" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-text mb-2">
            <span className="font-semibold">{activity.action}</span>{" "}
            {activity.title}
          </p>
          <p className="text-sm text-text-light">{activity.time}</p>
        </div>
      </div>
    </div>
  );
}
