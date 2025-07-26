import { useCallback, useState } from "react";
import { WelcomeBanner } from "../components";
import { LandingPageContainer } from "../components/layout";
import {
  HeroSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection,
  FeaturesSection,
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
    <LandingPageContainer>
      {showBanner && <WelcomeBanner closeBanner={handleCloseBanner} />}
      <HeroSection />
      <TestimonialsSection />
      <FeaturesSection />
      <FAQSection />
      <FinalCTASection />
    </LandingPageContainer>
  );
}
