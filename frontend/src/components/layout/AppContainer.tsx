import type { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
}

export default function AppContainer({ children }: AppContainerProps) {
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[100rem] mx-auto p-6 sm:p-8">{children}</div>
    </div>
  );
}
