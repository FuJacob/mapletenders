interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function BillingToggle({ billingCycle, onBillingCycleChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative p-1 bg-surface-warm rounded-xl border border-border-warm">
        <div className="flex items-center gap-1">
          {/* Monthly Button */}
          <button
            onClick={() => onBillingCycleChange("monthly")}
            className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-accent text-white shadow-sm"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            Monthly
          </button>
          
          {/* Yearly Button */}
          <button
            onClick={() => onBillingCycleChange("yearly")}
            className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-accent text-white shadow-sm"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            Yearly
            <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-200 border ${
              billingCycle === "yearly"
                ? "bg-white/20 text-white border-white/30"
                : "bg-maple/10 text-maple border-maple/20"
            }`}>
              Save 20%
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}