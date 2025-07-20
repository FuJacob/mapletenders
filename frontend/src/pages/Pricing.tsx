import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  selectIsAuthenticated,
  selectAuthUser,
  selectAuthProfile,
} from "../features/auth/authSelectors";
import { createCheckoutSession } from "../api/subscriptions";

// Components
import PricingHero from "../components/pricing/PricingHero";
import LoadingState from "../components/pricing/LoadingState";
import ErrorState from "../components/pricing/ErrorState";
import PricingCard from "../components/pricing/PricingCard";
import FeatureComparison from "../components/pricing/FeatureComparison";
import FAQ from "../components/pricing/FAQ";
import CTASection from "../components/pricing/CTASection";

// Hooks and types
import { usePricingData } from "../components/pricing/usePricingData";
import type { PricingTier } from "../components/pricing/types";

export default function Pricing() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser); // Supabase user info
  const profile = useAppSelector(selectAuthProfile); // Company profile data
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);

  const { pricingTiers, plansLoading, plansError } =
    usePricingData(billingCycle);

  const handlePlanSelect = async (tier: PricingTier) => {


    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to signup/login with plan info
      navigate(`/sign-up?plan=${tier.id}&billing=${billingCycle}`);
      return;
    }

    // User is authenticated, proceed with checkout
    setLoading(tier.id);
    try {
      // Use user data from Redux (no need to fetch again)
      const userEmail = user?.email || "";
      console.log("user", user);

      if (!userEmail) {
        alert("Unable to retrieve your email. Please try signing in again.");
        setLoading(null);
        return;
      }

      const response = await createCheckoutSession(
        tier.id,
        billingCycle,
        user.id,
        userEmail,
        profile?.company_name || ""
      );

      if (response.error) {
        console.error("Checkout error:", response.error);
        alert("Error creating checkout session. Please try again.");
      } else if (response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Error creating checkout session. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-background py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <PricingHero
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />

        {/* Loading State */}
        {plansLoading && <LoadingState />}

        {/* Error State */}
        {plansError && <ErrorState error={plansError} />}

        {/* Pricing Cards */}
        {!plansLoading && !plansError && (
          <section className="py-16 px-6 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 lg:gap-20 max-w-5xl mx-auto">
                {pricingTiers.map((tier) => (
                  <PricingCard
                    key={tier.id}
                    tier={tier}
                    loading={loading}
                    onPlanSelect={handlePlanSelect}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Feature Comparison */}
        {!plansLoading && !plansError && <FeatureComparison />}

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTASection isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
