import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import {
  selectAuthUser,
  selectAuthProfile,
} from "../features/auth/authSelectors";
import { createCheckoutSession } from "../api/subscriptions";
import { CreditCard } from "@phosphor-icons/react";
import { PageHeader } from "../components/ui";

// Components
import LoadingState from "../components/pricing/LoadingState";
import ErrorState from "../components/pricing/ErrorState";
import PricingCard from "../components/pricing/PricingCard";
import FeatureComparison from "../components/pricing/FeatureComparison";
import FAQ from "../components/pricing/FAQ";

// Hooks and types
import { usePricingData } from "../components/pricing/usePricingData";
import type { PricingTier } from "../components/pricing/types";

export default function PlansAppPage() {
  const user = useAppSelector(selectAuthUser);
  const profile = useAppSelector(selectAuthProfile);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<string | null>(null);

  const { pricingTiers, plansLoading, plansError } =
    usePricingData(billingCycle);

  const handlePlanSelect = async (tier: PricingTier) => {
    if (!user) return;

    setLoading(tier.id);
    try {
      const userEmail = user?.email || "";

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
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <PageHeader
          icon={<CreditCard className="w-10 h-10 text-primary" />}
          title="Plans & Billing"
          description="Upgrade your procurement intelligence with MapleTenders"
        />

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly" ? "text-primary" : "text-text-light"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`relative w-14 h-7 rounded-lg transition-colors ${
              billingCycle === "yearly" ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-lg top-1 transition-transform ${
                billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingCycle === "yearly" ? "text-primary" : "text-text-light"
            }`}
          >
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-lg ml-2">
              Save 20%
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Loading State */}
          {plansLoading && <LoadingState />}

          {/* Error State */}
          {plansError && <ErrorState error={plansError} />}

          {/* Pricing Cards */}
          {!plansLoading && !plansError && (
            <div className="grid md:grid-cols-2 gap-8">
              {pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  loading={loading}
                  onPlanSelect={handlePlanSelect}
                />
              ))}
            </div>
          )}

          {/* Feature Comparison */}
          {!plansLoading && !plansError && <FeatureComparison />}

          {/* FAQ Section */}
          <FAQ />
        </div>
      </div>
    </div>
  );
}
