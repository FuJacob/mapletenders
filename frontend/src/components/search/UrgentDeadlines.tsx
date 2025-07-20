import { Clock } from "@phosphor-icons/react";

interface DeadlineItem {
  title: string;
  daysRemaining: number;
  urgencyLevel: "urgent" | "warning";
}

interface UrgentDeadlinesProps {
  deadlines?: DeadlineItem[];
}

export default function UrgentDeadlines({ deadlines }: UrgentDeadlinesProps) {
  const defaultDeadlines: DeadlineItem[] = [
    {
      title: "Software Development RFP",
      daysRemaining: 2,
      urgencyLevel: "urgent",
    },
    {
      title: "IT Consulting Services",
      daysRemaining: 5,
      urgencyLevel: "warning",
    },
  ];

  const displayDeadlines = deadlines || defaultDeadlines;

  const getDeadlineStyles = (urgencyLevel: "urgent" | "warning") => {
    return urgencyLevel === "urgent"
      ? {
          containerClass: "bg-error/10 border-error/20",
          titleClass: "text-error",
          timeClass: "text-error",
        }
      : {
          containerClass: "bg-warning/10 border-warning/20",
          titleClass: "text-warning",
          timeClass: "text-warning",
        };
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-error" />
        Urgent Deadlines
      </h3>
      <div className="space-y-3">
        {displayDeadlines.map((deadline, index) => {
          const styles = getDeadlineStyles(deadline.urgencyLevel);
          return (
            <div
              key={index}
              className={`p-3 border rounded-lg ${styles.containerClass}`}
            >
              <p className={`text-sm font-medium ${styles.titleClass}`}>
                {deadline.title}
              </p>
              <p className={`text-xs ${styles.timeClass}`}>
                Due in {deadline.daysRemaining} days
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}