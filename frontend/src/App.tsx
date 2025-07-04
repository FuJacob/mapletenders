import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TenderData from "./pages/TenderData";
import LeadGenChatV2 from "./pages/LeadGenChatV2";
import Rfp from "./pages/Rfp";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tenderdata" element={<TenderData />} />
      <Route path="/leadgenchatv2" element={<LeadGenChatV2 />} />
      <Route path="/rfp" element={<Rfp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
