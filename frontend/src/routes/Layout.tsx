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
      "/dashboard",
      "/search",
      "/table",
      "/rfp-analysis",
      "/calendar",
      "/bookmarks",
      "/analytics",
    ].includes(location.pathname);

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
      <div className="h-screen bg-background overflow-hidden">
        {/* CSS Grid Layout for precise space allocation */}
        <div className="h-full grid grid-cols-1 lg:grid-cols-[256px_1fr] grid-rows-[auto_1fr]">
          {/* Sidebar - spans full height on desktop */}
          <div className="hidden lg:block lg:row-span-2">
            <Sidebar />
          </div>
          
          {/* Header - spans remaining width */}
          <div className="lg:col-start-2">
            <Header />
          </div>
          
          {/* Main Content - fills remaining space exactly */}
          <div className="lg:col-start-2 overflow-hidden">
            <AppPageContainer>
              <Outlet />
            </AppPageContainer>
          </div>
        </div>
        
        {/* Mobile sidebar overlay */}
        <div className="lg:hidden">
          <Sidebar />
        </div>
      </div>
    );
  }

  // For other authenticated pages (no sidebar)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
