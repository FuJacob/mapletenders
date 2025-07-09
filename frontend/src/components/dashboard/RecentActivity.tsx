import ActivityItem from "./ActivityItem.tsx";
import type { Activity } from "./types.tsx";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">
          Recent Activity
        </h2>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}
