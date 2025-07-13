import { useState, useEffect } from "react";
import { getPlans, type Plan } from "../../api/subscriptions";
import type { PricingTier } from "./types";

// Helper function to get plan description
const getPlanDescription = (planName: string): string => {
  switch (planName.toLowerCase()) {
    case "starter":
      return "Perfect for freelancers and small businesses getting started";
    case "pro":
    case "professional":
      return "Ideal for growing companies winning more contracts";
    default:
      return "Comprehensive solution for your business needs";
  }
};

// Helper function to get plan features
const getPlanFeatures = (planName: string): string[] => {
  const baseFeatures = [
    "AI-powered tender search",
    "Email notifications",
    "Mobile app access",
  ];

  if (planName.toLowerCase() === "starter") {
    return [
      ...baseFeatures,
      "Basic search filters",
      "Export to CSV",
      "Standard support",
    ];
  } else {
    return [
      ...baseFeatures,
      "Everything in Starter",
      "Advanced AI search",
      "Win probability analysis",
      "Smart alerts & notifications",
      "Priority support",
      "API access",
    ];
  }
};

// Helper function to format limits
const formatLimits = (limits: Record<string, unknown>) => {
  return {
    searches: limits.searches === -1 ? "Unlimited" : `${limits.searches}/month`,
    alerts:
      limits.alerts === -1 ? "Unlimited" : `${limits.alerts} active alerts`,
    exports: limits.exports === -1 ? "Unlimited" : `${limits.exports}/month`,
    users:
      limits.users === -1
        ? "Unlimited"
        : `${limits.users} user${Number(limits.users) > 1 ? "s" : ""}`,
  };
};

export function usePricingData(billingCycle: "monthly" | "yearly") {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
        setPlansError(null);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlansError("Failed to load pricing plans. Please try again later.");
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Convert database plans to display format
  const pricingTiers: PricingTier[] = plans.map((plan, index) => {
    const monthlyPrice = plan.price_monthly / 100; // Convert from cents
    const yearlyPrice = plan.price_yearly / 100; // Convert from cents

    return {
      id: plan.id,
      name: plan.name,
      price: billingCycle === "monthly" ? monthlyPrice : yearlyPrice,
      originalPrice: billingCycle === "yearly" ? monthlyPrice * 12 : undefined,
      billingCycle,
      popular: index === 1, // Make the second plan (Pro) popular
      description: getPlanDescription(plan.name),
      features: getPlanFeatures(plan.name),
      limits: formatLimits(plan.limits as Record<string, unknown>),
      cta:
        plan.name.toLowerCase() === "starter"
          ? "Get Starter"
          : "Start Free Trial",
      stripeProductId: plan.stripe_product_id || undefined,
    };
  });

  return {
    pricingTiers,
    plansLoading,
    plansError,
  };
}
