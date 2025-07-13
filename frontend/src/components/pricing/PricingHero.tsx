import { Link } from "react-router-dom";
import { ArrowLeft, Target, ChartBar, Lightning } from "@phosphor-icons/react";
import BillingToggle from "./BillingToggle";

interface PricingHeroProps {
  billingCycle: "monthly" | "yearly";
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function PricingHero({ billingCycle, onBillingCycleChange }: PricingHeroProps) {
  return (
    <section className="relative py-20 px-6 text-center overflow-hidden">
      {/* Background Elements removed */}
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-light hover:text-primary transition-all duration-300 hover:gap-3 mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-text">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-text-light mb-4 max-w-3xl mx-auto leading-relaxed">
            Transform your government contracting success with our AI-powered platform
          </p>
          <p className="text-lg text-text-light max-w-2xl mx-auto">
            Join thousands of companies winning more contracts • All plans include a 14-day free trial
          </p>
        </div>

        <div className="mb-8">
          <BillingToggle 
            billingCycle={billingCycle}
            onBillingCycleChange={onBillingCycleChange}
          />
        </div>

        {/* Value Proposition Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex justify-center mb-2">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">AI-Powered Search</h3>
            <p className="text-sm text-text-light">Find relevant opportunities faster with intelligent matching</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex justify-center mb-2">
              <ChartBar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">Win Probability</h3>
            <p className="text-sm text-text-light">Get data-driven insights on your chances of success</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <div className="flex justify-center mb-2">
              <Lightning className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-text mb-2">Real-time Alerts</h3>
            <p className="text-sm text-text-light">Never miss a deadline with smart notifications</p>
          </div>
        </div>
      </div>
    </section>
  );
}