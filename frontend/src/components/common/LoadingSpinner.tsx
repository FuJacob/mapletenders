import React from "react";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { LogoTitle } from "../ui/LogoTitle";
interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({
  message = "Getting you closer to your next contract...",
}: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 bg-surface bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center text-center">
        <LogoTitle />
        <p className="text-text mb-6">{message}</p>
        <CircleNotchIcon size={48} className="text-primary animate-spin" />
      </div>
    </div>
  );
}

export default React.memo(LoadingSpinner);
