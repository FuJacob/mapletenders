import { Outlet, useLocation } from "react-router-dom";
import { Footer, Header, Sidebar } from "../components";
import AppPageContainer from "../components/layout/AppPageContainer";
import { useAuth } from "../hooks/auth";

export default function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Define which routes are landing pages (no header/footer, different styling)
  const isLandingPage = ["/", "/about", "/contact", "/pricing"].includes(
    location.pathname
  );

  // Define which routes are app pages (show sidebar)
  const isAppPage =
    isAuthenticated &&
    [
      "/home",
      "/search",
      "/table",
      "/rfp-analysis",
      "/calendar",
      "/bookmarks",
      "/analytics",
      "/profile",
      "/plans",
    ].includes(location.pathname);

  // Special handling for /plans route
  if (location.pathname === "/plans" && !isAuthenticated) {
    // Non-authenticated users see plans as landing page
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  // For app pages with sidebar
  if (isAppPage) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header className="flex-shrink-0" />
          <main className="flex-1 overflow-hidden">
            <AppPageContainer>
              <Outlet />
            </AppPageContainer>
          </main>
        </div>
      </div>
    );
  }

  // For other authenticated pages (no sidebar)
  return (
    <div className="min-h-screen bg-background w-full">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
