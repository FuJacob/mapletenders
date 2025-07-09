import { Calendar, MapPin, Clock, ArrowSquareOut } from "@phosphor-icons/react";
import type { Activity } from "./types.tsx";

interface ActivityItemProps {
  activity: Activity;
}

export default function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-text mb-2 hover:text-primary transition-colors flex items-center gap-2">
            <span className="font-semibold">{activity.action}</span>{" "}
            {activity.title}
            <ArrowSquareOut className="w-4 h-4 text-text-light" />
          </h3>

          {activity.description && (
            <p
              className="text-sm text-text-light mb-2 overflow-hidden text-ellipsis"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {activity.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-text-light">
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {activity.location}
              </span>
            )}
            {activity.publishDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Published {new Date(activity.publishDate).toLocaleDateString()}
              </span>
            )}
            {activity.closingDate && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Due {new Date(activity.closingDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-border text-text-light px-2 py-1 rounded text-xs">
            {activity.action}
          </span>
          <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">
            {new Date(activity.time).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <button className="text-primary hover:text-primary-dark text-sm font-medium">
          View Details →
        </button>
      </div>
    </div>
  );
}
