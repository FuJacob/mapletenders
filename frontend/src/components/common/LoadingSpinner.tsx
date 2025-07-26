import React from "react";
import { CircleNotch } from "@phosphor-icons/react";
import { LogoTitle } from "../ui/LogoTitle";

type LoadingSpinnerVariant = "overlay" | "inline" | "table" | "calendar";

interface LoadingSpinnerProps {
  message?: string;
  variant?: LoadingSpinnerVariant;
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  rowCount?: number; // For table variant
}

function LoadingSpinner({
  message = "Getting you closer to your next contract...",
  variant = "overlay",
  size = "md",
  showLogo = true,
  rowCount = 5,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-12 h-12"
  };

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 bg-surface bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center text-center">
          {showLogo && <LogoTitle />}
          <p className="text-text mb-6">{message}</p>
          <CircleNotch size={48} className="text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center py-8 text-center">
        <CircleNotch className={`text-primary animate-spin mr-3 ${sizeClasses[size]}`} />
        <span className="text-text-muted">{message}</span>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-8 text-center">
          <CircleNotch className={`text-primary animate-spin mr-3 ${sizeClasses[size]}`} />
          <span className="text-text-muted">{message}</span>
        </div>

        <div className="space-y-3 px-6 pb-6">
          {Array.from({ length: rowCount }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                  <div className="h-4 bg-surface-muted rounded w-1/2"></div>
                </div>
                <div className="w-20 h-4 bg-surface-muted rounded"></div>
                <div className="w-24 h-4 bg-surface-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "calendar") {
    return (
      <div className="bg-surface rounded-lg border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border bg-surface">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-20 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
            <div className="w-16 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
            <div className="w-16 h-9 bg-surface-muted rounded-lg animate-pulse"></div>
          </div>

          <div className="w-32 h-8 bg-surface-muted rounded-lg animate-pulse mb-4 sm:mb-0"></div>

          <div className="flex gap-1 bg-background border border-border rounded-lg p-1">
            {["month", "week", "day", "agenda"].map((_, index) => (
              <div
                key={index}
                className="w-16 h-8 bg-surface-muted rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="p-8 text-center" style={{ height: "600px" }}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <CircleNotch className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Loading Calendar
            </h3>
            <p className="text-text-muted">
              {message}
            </p>

            <div className="mt-8 grid grid-cols-7 gap-2 w-full max-w-lg">
              {Array.from({ length: 35 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-surface-muted rounded animate-pulse"
                  style={{ animationDelay: `${index * 50}ms` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default React.memo(LoadingSpinner);
