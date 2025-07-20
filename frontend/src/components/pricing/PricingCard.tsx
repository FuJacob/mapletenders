import {
  Lightning,
  Target,
  CheckCircle,
  Leaf,
  Shield,
} from "@phosphor-icons/react";
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
      className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg ${
        tier.popular
          ? "border-accent bg-gradient-to-br from-accent/5 to-maple/5 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          : "border-border-warm bg-surface hover:border-accent/30 hover:scale-[1.01]"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-1 bg-gradient-to-r from-accent to-maple text-white text-sm font-medium rounded-full flex items-center gap-1 shadow-sm">
            <Leaf className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 rounded-xl bg-surface-warm border border-border-warm">
            {tier.id === "starter" && (
              <Lightning className="w-8 h-8 text-maple" />
            )}
            {(tier.id === "professional" ||
              tier.name.toLowerCase() === "pro") && (
              <Target className="w-8 h-8 text-accent" />
            )}
            {tier.id === "enterprise" && (
              <Shield className="w-8 h-8 text-success" />
            )}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-text mb-3">{tier.name}</h3>
        <p className="text-text-muted text-sm mb-6 leading-relaxed px-2">
          {tier.description}
        </p>
        <div className="text-center">
          {tier.originalPrice && tier.billingCycle === "yearly" && (
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-lg text-text-light line-through">
                ${tier.originalPrice}
              </span>
              <span className="px-2 py-1 bg-maple/10 text-maple text-xs rounded-full font-medium border border-maple/20">
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
            <span className="text-text-muted">
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
      <div className="mb-6 p-4 bg-surface-warm rounded-lg border border-border-warm">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <span className="text-text-muted block mb-1">Searches</span>
            <div className="font-bold text-text text-lg">
              {tier.limits.searches}
            </div>
          </div>
          <div className="text-center">
            <span className="text-text-muted block mb-1">Alerts</span>
            <div className="font-bold text-text text-lg">
              {tier.limits.alerts}
            </div>
          </div>
          <div className="text-center">
            <span className="text-text-muted block mb-1">Exports</span>
            <div className="font-bold text-text text-lg">
              {tier.limits.exports}
            </div>
          </div>
          <div className="text-center">
            <span className="text-text-muted block mb-1">Users</span>
            <div className="font-bold text-text text-lg">
              {tier.limits.users}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-text leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onPlanSelect(tier)}
        disabled={loading === tier.id}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
          tier.popular
            ? "bg-gradient-to-r from-accent to-maple text-white hover:from-accent/90 hover:to-maple/90"
            : "border border-border-warm text-text hover:bg-surface-warm hover:border-accent"
        }`}
      >
        {loading === tier.id ? "Loading..." : tier.cta}
      </button>

      {tier.id !== "enterprise" && (
        <p className="text-xs text-center text-text-muted mt-3">
          14-day free trial • No credit card required
        </p>
      )}
    </div>
  );
}
