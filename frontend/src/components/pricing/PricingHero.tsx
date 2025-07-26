import {
  Target,
  ChartBar,
  Lightning,
  Leaf,
  Timer,
  Building,
  Star,
} from "@phosphor-icons/react";
import BillingToggle from "./BillingToggle";

interface PricingHeroProps {
  billingCycle: "monthly" | "yearly";
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function PricingHero({
  billingCycle,
  onBillingCycleChange,
}: PricingHeroProps) {
  return (
    <section className="relative py-8 px-6 overflow-hidden bg-surface">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Main Heading Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-lg text-sm font-medium mb-4">
            <Leaf className="w-3 h-3" />
            Canada's Procurement Intelligence Platform
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-text">
            Win More Government Contracts
          </h1>
          <p className="text-lg text-text-muted mb-6 max-w-2xl mx-auto">
            Stop searching through dozens of procurement sites. Our AI finds
            opportunities that match your business across all Canadian
            jurisdictions.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-text-muted mb-6">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-success" />
              <span>500+ Canadian businesses</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-success" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-maple" />
              <span>No setup fees</span>
            </div>
          </div>

          <BillingToggle
            billingCycle={billingCycle}
            onBillingCycleChange={onBillingCycleChange}
          />
        </div>

        {/* Value Proposition - Streamlined */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 rounded-lg bg-surface-warm border border-border-warm hover:border-accent/30 transition-colors">
            <div className="inline-flex p-3 bg-accent/10 rounded-lg mb-4">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-text mb-2">Smart Matching</h3>
            <p className="text-sm text-text-muted">
              AI finds contracts that actually fit your capabilities and
              experience
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-surface-warm border border-border-warm hover:border-maple/30 transition-colors">
            <div className="inline-flex p-3 bg-maple/10 rounded-lg mb-4">
              <Lightning className="w-6 h-6 text-maple" />
            </div>
            <h3 className="font-semibold text-text mb-2">Save Time</h3>
            <p className="text-sm text-text-muted">
              Skip manual searches across multiple government procurement
              portals
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-surface-warm border border-border-warm hover:border-success/30 transition-colors">
            <div className="inline-flex p-3 bg-success/10 rounded-lg mb-4">
              <ChartBar className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-text mb-2">Real Results</h3>
            <p className="text-sm text-text-muted">
              Track deadlines, analyze competition, and increase your win rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
