import type { ReactNode } from "react";

interface AppPageContainerProps {
  children: ReactNode;
}

export default function AppPageContainer({ children }: AppPageContainerProps) {
  return <div className="p-12 h-full w-full overflow-auto">{children}</div>;
}
