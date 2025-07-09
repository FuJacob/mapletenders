import {
  Eye,
  ArrowSquareOut,
  MapPin,
  Calendar,
  Clock,
} from "@phosphor-icons/react";
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
          <p className="font-semibold text-text mb-2 flex items-center gap-2">
            <span className="font-semibold">{activity.action}</span>{" "}
            {activity.title}
            <ArrowSquareOut className="w-4 h-4 text-text-light" />
          </p>

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

          <div className="space-y-1 text-xs text-text-light">
            <p className="font-medium">
              {new Date(activity.time).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {activity.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Location: {activity.location}</span>
              </div>
            )}

            {activity.publishDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Published:{" "}
                  {new Date(activity.publishDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {activity.closingDate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  Closing: {new Date(activity.closingDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
