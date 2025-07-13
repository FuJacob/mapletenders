import { useCallback, useState } from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import {
  HeroSection,
  TrustStatsSection,
  ProblemSolutionSection,
  KeyFeaturesSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection,
} from "../components/sections";

export default function LandingPage() {
  const [showBanner, setShowBanner] = useState(
    localStorage.getItem("maplebids:welcomeBannerClosed") !== "true"
  );
  
  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem("maplebids:welcomeBannerClosed", "true");
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      {showBanner && <WelcomeBanner closeBanner={handleCloseBanner} />}
      <HeroSection />
      <TrustStatsSection />
      <KeyFeaturesSection />
      <ProblemSolutionSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
