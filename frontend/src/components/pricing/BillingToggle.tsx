interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void;
}

export default function BillingToggle({ billingCycle, onBillingCycleChange }: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative p-2 bg-surface rounded-2xl border border-border">
        <div className="flex items-center gap-1">
          {/* Monthly Button */}
          <button
            onClick={() => onBillingCycleChange("monthly")}
            className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-primary text-white"
                : "text-text-light hover:text-text hover:bg-background/50"
            }`}
          >
            Monthly
          </button>
          
          {/* Yearly Button */}
          <button
            onClick={() => onBillingCycleChange("yearly")}
            className={`relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-primary text-white"
                : "text-text-light hover:text-text hover:bg-background/50"
            }`}
          >
            Yearly
            <span className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-primary/20 text-white"
                : "bg-success/10 text-success"
            }`}>
              Save 20%
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}