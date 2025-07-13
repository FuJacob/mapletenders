import { Lightning, Target, Star, CheckCircle } from "@phosphor-icons/react";
import type { PricingTier } from "./types";

interface PricingCardProps {
  tier: PricingTier;
  loading: string | null;
  onPlanSelect: (tier: PricingTier) => void;
}

export default function PricingCard({
  tier,
  loading,
  onPlanSelect,
}: PricingCardProps) {
  return (
    <div
      className={`relative rounded-2xl border-2 p-8 ${
        tier.popular
          ? "border-primary bg-primary/5 scale-105"
          : "border-border bg-surface"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {tier.id === "starter" && (
            <Lightning className="w-8 h-8 text-accent" />
          )}
          {(tier.id === "professional" ||
            tier.name.toLowerCase() === "pro") && (
            <Target className="w-8 h-8 text-primary" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-text mb-2">{tier.name}</h3>
        <p className="text-text-light text-sm mb-4">{tier.description}</p>
        <div className="text-center">
          {tier.originalPrice && tier.billingCycle === "yearly" && (
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg text-text-light line-through">
                ${tier.originalPrice}
              </span>
              <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                Save{" "}
                {Math.round(
                  ((tier.originalPrice - tier.price) / tier.originalPrice) * 100
                )}
                %
              </span>
            </div>
          )}
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-text">${tier.price}</span>
            <span className="text-text-light">
              /{tier.billingCycle === "monthly" ? "month" : "year"}
            </span>
          </div>
          {tier.billingCycle === "yearly" && (
            <p className="text-xs text-text-light mt-1">
              ${Math.round(tier.price / 12)}/month billed annually
            </p>
          )}
        </div>
      </div>

      {/* Limits */}
      <div className="mb-6 p-4 bg-background rounded-lg">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-text-light">Searches:</span>
            <div className="font-medium text-text">{tier.limits.searches}</div>
          </div>
          <div>
            <span className="text-text-light">Alerts:</span>
            <div className="font-medium text-text">{tier.limits.alerts}</div>
          </div>
          <div>
            <span className="text-text-light">Exports:</span>
            <div className="font-medium text-text">{tier.limits.exports}</div>
          </div>
          <div>
            <span className="text-text-light">Users:</span>
            <div className="font-medium text-text">{tier.limits.users}</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-text">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onPlanSelect(tier)}
        disabled={loading === tier.id}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          tier.popular
            ? "bg-primary text-white hover:bg-primary-dark"
            : "border border-border text-text hover:bg-surface hover:border-primary"
        }`}
      >
        {loading === tier.id ? "Loading..." : tier.cta}
      </button>

      {tier.id !== "enterprise" && (
        <p className="text-xs text-center text-text-light mt-3">
          14-day free trial • No credit card required
        </p>
      )}
    </div>
  );
}
