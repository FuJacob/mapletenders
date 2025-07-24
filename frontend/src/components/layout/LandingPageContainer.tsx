import type { ReactNode } from "react";

interface LandingPageContainerProps {
  children: ReactNode;
}

export default function LandingPageContainer({
  children,
}: LandingPageContainerProps) {
  return <div className="min-h-screen mx-auto">{children}</div>;
}
