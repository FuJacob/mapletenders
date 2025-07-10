import {
  Heart,
  TrendUp,
  CurrencyDollar,
  Users,
  Rocket,
} from "@phosphor-icons/react";

export default function TrustStatsSection() {
  return (
    <section className="min-h-2/3 flex flex-col items-center justify-center py-32 px-6 border-t border-border bg-surface overflow-hidden">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
          <div className="flex items-center gap-8">
            <Heart className="text-primary" size={120} weight="fill" />
            <div>
              <h2 className="text-5xl font-extrabold text-text leading-tight mb-2">
                Loved by thousands
              </h2>
              <div className="text-3xl font-semibold text-primary mb-2">
                of Canadian businesses
              </div>
              <p className="text-xl text-text-light max-w-xl">
                Join businesses winning more government contracts with
                AI-powered intelligence
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-8">
            <div className="flex items-center gap-3">
              <TrendUp size={40} className="text-success" weight="duotone" />
              <span className="text-5xl font-bold text-success">47K+</span>
              <span className="text-lg text-text-light uppercase tracking-wider ml-2">
                Active Tenders
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CurrencyDollar
                size={32}
                className="text-text"
                weight="duotone"
              />
              <span className="text-4xl font-bold text-text">$3.2B</span>
              <span className="text-lg text-text-light uppercase tracking-wider ml-2">
                Contract Value
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users size={32} className="text-primary" weight="duotone" />
              <span className="text-2xl font-bold text-text">2,847</span>
              <span className="text-sm text-text-light ml-2">Active Users</span>
            </div>
            <div className="flex items-center gap-3">
              <Rocket size={32} className="text-primary" weight="duotone" />
              <span className="text-2xl font-bold text-primary">95%</span>
              <span className="text-sm text-text-light ml-2">Time Saved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
