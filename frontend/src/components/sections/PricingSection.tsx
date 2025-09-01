import { useState, useEffect, memo, useCallback } from "react";
import { Switch } from "@headlessui/react";
import { Check, Lightning } from "@phosphor-icons/react";
import { useAuth } from "../../hooks/auth";
import {
  getPlans,
  createCheckoutSession,
  type Plan,
} from "../../api/subscriptions";

interface Feature {
  name: string;
  included: boolean;
}

const PricingSection = memo(function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = useCallback(
    async (plan: Plan) => {
      if (!user) {
        window.location.href = "/sign-up";
        return;
      }

      setProcessingPlan(plan.id);
      try {
        const response = await createCheckoutSession(
          plan.id,
          isYearly ? "yearly" : "monthly",
          user.id,
          user.email || "",
          user.user_metadata?.full_name || ""
        );

        if (response.error) {
          console.error("Checkout error:", response.error);
          alert("Something went wrong. Please try again.");
        } else if (response.url) {
          window.location.href = response.url;
        }
      } catch (error) {
        console.error("Subscription error:", error);
        alert("Something went wrong. Please try again.");
      } finally {
        setProcessingPlan(null);
      }
    },
    [user, isYearly]
  );

  const formatFeatures = useCallback((plan: Plan): Feature[] => {
    if (!plan.features || typeof plan.features !== "object") return [];

    return Object.entries(plan.features).map(([name, included]) => ({
      name,
      included: Boolean(included),
    }));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-background" id="pricing">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-surface rounded w-96 mx-auto mb-8"></div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-96 bg-surface border border-border rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background " id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              We're not here to <span className="text-primary">nickel</span> and{" "}
              <span className="text-primary">dime</span> you either.
            </h2>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Unlike other procurement portals, we believe businesses should be
              able to get the information they need to win contracts, without
              breaking the bank.
            </p>
          </div>
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                !isYearly ? "text-text" : "text-text-muted"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onChange={setIsYearly}
              className={`${
                isYearly ? "bg-primary" : "bg-border"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <span
                className={`${
                  isYearly ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span
              className={`text-sm font-medium ${
                isYearly ? "text-text" : "text-text-muted"
              }`}
            >
              Yearly
            </span>
            <span className="bg-primary px-3 py-1 rounded-lg text-xs font-medium shadow-md text-white">
              20% off
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const features = formatFeatures(plan);
            const isPopular = index === 1; // Make second plan popular
            const isProcessing = processingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-surface border-2 rounded-2xl p-8 ${
                  isPopular
                    ? "border-primary shadow-xl"
                    : "border-border hover:border-primary/20"
                } transition-all duration-300`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      POPULAR
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-text mb-4">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-text">
                      $
                      {isYearly
                        ? Math.round(plan.price_yearly / 12)
                        : plan.price_monthly}
                    </span>
                    <span className="text-text-muted ml-1">/month</span>
                  </div>

                  {/* Billing Info */}
                  <p className="text-sm text-text-muted">
                    {isYearly ? (
                      <>Billed annually (${plan.price_yearly}/year)</>
                    ) : (
                      "Billed monthly"
                    )}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <Check
                          className={`w-5 h-5 ${
                            feature.included
                              ? "text-primary"
                              : "text-text-muted"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included ? "text-text" : "text-text-muted"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 ${
                    isPopular
                      ? "bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl"
                      : "bg-primary text-white hover:bg-primary-dark"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Lightning className="w-4 h-4 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default PricingSection;
