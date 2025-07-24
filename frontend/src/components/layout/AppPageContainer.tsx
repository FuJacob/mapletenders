import type { ReactNode } from "react";

interface AppPageContainerProps {
  children: ReactNode;
}

export default function AppPageContainer({ children }: AppPageContainerProps) {
  return (
    <div className="h-full w-full overflow-hidden">
      {/* Main content area that fills remaining space */}
      <div className="h-full flex flex-col">
        {/* Content wrapper with proper spacing */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}