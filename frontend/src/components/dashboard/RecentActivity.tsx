import ActivityItem from "./ActivityItem.tsx";
import type { Activity } from "./types.tsx";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-surface p-6 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Recent Activity</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
