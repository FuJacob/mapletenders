import type { ReactNode } from "react";

import GuestHeader from "./GuestHeader";

interface LandingPageContainerProps {
  children: ReactNode;
}

export default function LandingPageContainer({
  children,
}: LandingPageContainerProps) {
  return (
    <>
      <GuestHeader />
      <div className="min-h-screen mx-auto">{children}</div>
    </>
  );
}
