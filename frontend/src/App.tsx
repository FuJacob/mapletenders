import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LeadGenChatV2 from "./pages/LeadGenChatV2";
import Rfp from "./pages/Rfp";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import GuestRoutes from "./routes/GuestRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import OnboardingRequiredRoutes from "./routes/OnboardingRequiredRoutes";
import { useAppDispatch } from "./app/hooks";
import { loadSession } from "./features/auth/authThunks";
import { useEffect } from "react";
import TableView from "./pages/TableView";
import Test from "./pages/Test";

export function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<GuestRoutes />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route element={<OnboardingRequiredRoutes />}>
          <Route path="/table-view" element={<TableView />} />
          <Route path="/rfp" element={<Rfp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>
      <Route path="/test" element={<Test />} />
      <Route path="/leadgenchatv2" element={<LeadGenChatV2 />} />
    </Routes>
  );
}

export default App;
