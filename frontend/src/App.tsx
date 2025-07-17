import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import TenderNotice from "./pages/TenderNotice";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import RfpAnalysis from "./pages/RfpAnalysis";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import Plans from "./pages/Plans";
import GuestRoutes from "./routes/GuestRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OnboardingRequiredRoutes from "./routes/OnboardingRequiredRoutes";
import { useAppDispatch } from "./app/hooks";
import { loadSession } from "./features/auth/authThunks";
import { useEffect, useCallback } from "react";
import TableView from "./pages/TableView";
import Test from "./pages/Test";
import Layout from "./routes/Layout";
import { refreshTenders } from "./api";
import { loadTenders } from "./features/tenders/tendersThunk";
import CalendarPage from "./pages/CalendarPage";

export function App() {
  const dispatch = useAppDispatch();

  // Memoize initialization logic
  const initializeApp = useCallback(() => {
    dispatch(loadTenders());
    refreshTenders();
    dispatch(loadSession());
  }, [dispatch]);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
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
          <Route path="/pricing" element={<Pricing />} />
          <Route
            path="/subscription/success"
            element={<SubscriptionSuccess />}
          />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<OnboardingRequiredRoutes />}>
            <Route path="/table-view" element={<TableView />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/rfp-analysis" element={<RfpAnalysis />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/tender-notice/:tenderId" element={<TenderNotice />} />
          </Route>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
        <Route path="/test" element={<Test />} />
      </Route>
    </Routes>
  );
}

export default App;
