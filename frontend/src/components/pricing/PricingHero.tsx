import { Link } from "react-router-dom";
import { ArrowLeft, Target, ChartBar, Lightning, Leaf, MapPin } from "@phosphor-icons/react";
import BillingToggle from "./BillingToggle";

interface PricingHeroProps {
  billingCycle: "monthly" | "yearly";
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function PricingHero({ billingCycle, onBillingCycleChange }: PricingHeroProps) {
  return (
    <section className="relative py-20 px-6 text-center overflow-hidden bg-gradient-to-b from-surface-warm to-surface">
      {/* Canadian Heritage Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 transform -rotate-12">
          <Leaf className="w-32 h-32 text-maple" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform rotate-12">
          <Leaf className="w-24 h-24 text-maple" />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-all duration-300 hover:gap-3 mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-8">
          {/* Canadian Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            Built by Canadians, for Canadians
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text">
            Choose Your <span className="text-accent">Canadian</span> Advantage
          </h1>
          <p className="text-xl md:text-2xl text-text-muted mb-4 max-w-3xl mx-auto leading-relaxed">
            Access government opportunities across all provinces and territories with our AI-powered procurement intelligence
          </p>
          <div className="flex items-center justify-center gap-2 text-lg text-text-muted max-w-2xl mx-auto">
            <MapPin className="w-5 h-5 text-accent" />
            <span>Serving contractors from coast to coast • 14-day free trial included</span>
          </div>
        </div>

        <div className="mb-8">
          <BillingToggle 
            billingCycle={billingCycle}
            onBillingCycleChange={onBillingCycleChange}
          />
        </div>

        {/* Value Proposition Cards - Enhanced with Canadian Focus */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-surface border border-border-warm shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                <Target className="w-8 h-8 text-accent" />
              </div>
            </div>
            <h3 className="font-semibold text-text mb-2">Intelligent Efficiency</h3>
            <p className="text-sm text-text-muted leading-relaxed">AI that saves time and reveals insights manual processes miss</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border-warm shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-maple/10 rounded-full group-hover:bg-maple/20 transition-colors">
                <ChartBar className="w-8 h-8 text-maple" />
              </div>
            </div>
            <h3 className="font-semibold text-text mb-2">Accessibility First</h3>
            <p className="text-sm text-text-muted leading-relaxed">Equal access for solo contractors to growing companies</p>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-border-warm shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-success/10 rounded-full group-hover:bg-success/20 transition-colors">
                <Lightning className="w-8 h-8 text-success" />
              </div>
            </div>
            <h3 className="font-semibold text-text mb-2">Transparency & Trust</h3>
            <p className="text-sm text-text-muted leading-relaxed">Clear, fair procurement intelligence without bureaucratic jargon</p>
          </div>
        </div>
      </div>
    </section>
  );
}