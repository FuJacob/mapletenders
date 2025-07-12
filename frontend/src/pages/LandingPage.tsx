import { useCallback, useState } from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import {
  HeroSection,
  TrustStatsSection,
  ProblemSolutionSection,
  BuiltForSection,
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
    <div className="min-h-screen bg-background">
      {showBanner && <WelcomeBanner closeBanner={handleCloseBanner} />}
      <HeroSection />
      <TrustStatsSection />
      <ProblemSolutionSection />
      <BuiltForSection />
      <KeyFeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
