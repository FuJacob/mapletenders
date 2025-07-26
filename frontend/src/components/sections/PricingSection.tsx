import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Check } from "@phosphor-icons/react";

interface Feature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: Feature[];
  popular?: boolean;
  cta: string;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: 5,
    yearlyPrice: 48,
    features: [
      { name: "Access to all Canadian tenders", included: true },
      { name: "AI-powered tender search", included: true },
      { name: "Saved searches & alerts", included: true },
      { name: "Basic fit scoring & tags", included: true },
      { name: "Smart filtering & categories", included: true },
      { name: "Email summaries", included: true },
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Pro",
    monthlyPrice: 10,
    yearlyPrice: 96,
    popular: true,
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Advanced AI document analysis", included: true },
      { name: "Contract value risk prediction", included: true },
      { name: "CRM export integrations", included: true },
      { name: "Priority support", included: true },
      { name: "Dedicated onboarding", included: true },
    ],
    cta: "Start Free Trial",
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 bg-background " id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              We're not here to <span className="text-primary">nickel</span>{" "}
              and <span className="text-primary">dime</span> you either.
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
            <span className="bg-primary text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md text-text-muted">
              20% off
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-surface border-2 rounded-2xl p-8 ${
                plan.popular
                  ? "border-primary shadow-xl"
                  : "border-border hover:border-primary/20"
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {plan.popular && (
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
                      ? plan.name === "Starter"
                        ? 4
                        : 8
                      : plan.monthlyPrice}
                  </span>
                  <span className="text-text-muted ml-1">/month</span>
                </div>

                {/* Billing Info */}
                <p className="text-sm text-text-muted">
                  {isYearly ? (
                    <>Billed annually (${plan.yearlyPrice}/year)</>
                  ) : (
                    "Billed monthly"
                  )}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Check
                        className={`w-5 h-5 ${
                          feature.included ? "text-primary" : "text-text-muted"
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
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
