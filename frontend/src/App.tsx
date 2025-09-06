import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAppDispatch } from "./app/hooks";
import { loadSession } from "./features/auth/authThunks";
import { useEffect, useCallback, Suspense, lazy } from "react";
import Layout from "./routes/Layout";
import GuestRoutes from "./routes/GuestRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OnboardingRequiredRoutes from "./routes/OnboardingRequiredRoutes";
import ErrorBoundary from "./components/ui/ErrorBoundary";

// Lazy load components for better performance
const LandingPage = lazy(() => import("./pages/LandingPage"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const SubscriptionCancel = lazy(() => import("./pages/SubscriptionCancel"));

// Protected pages - lazy loaded
const HomePage = lazy(() => import("./pages/HomePage"));
const Home = lazy(() => import("./pages/Home"));
const TableView = lazy(() => import("./pages/TableView"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdvancedSearchPage = lazy(() => import("./pages/AdvancedSearchPage"));
const TablePage = lazy(() => import("./pages/TablePage"));
const RfpAnalysis = lazy(() => import("./pages/RfpAnalysis"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const Profile = lazy(() => import("./pages/Profile"));
const TenderNotice = lazy(() => import("./pages/TenderNoticePage"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Test = lazy(() => import("./pages/Test"));

import { useAuth } from "./hooks/auth";
export function App() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  // Memoize initialization logic
  const initializeApp = useCallback(() => {
    if (!user) {
      dispatch(loadSession());
    }
  }, [dispatch, user]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<GuestRoutes />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="/subscription/success"
              element={<SubscriptionSuccess />}
            />
            <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route element={<OnboardingRequiredRoutes />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/table-view" element={<TableView />} />
              <Route path="/home" element={<Home />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search/advanced" element={<AdvancedSearchPage />} />
              <Route path="/table" element={<TablePage />} />
              <Route path="/rfp-analysis" element={<RfpAnalysis />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/teams" element={<TeamManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tender-notice/:tenderId" element={<TenderNotice />} />
            </Route>
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
          <Route path="/test" element={<Test />} />
        </Route>
        </Routes>
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
