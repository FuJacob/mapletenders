import { Target, MapPin, Timer } from "@phosphor-icons/react";

export default function TrustStatsSection() {
  return (
    <section className="py-16 px-6 bg-surface space-y-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-text mb-3">
            Trusted by Canadian contractors
          </h2>
          <p className="text-text-muted">
            Join businesses winning more government contracts with AI-powered
            intelligence
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-text mb-2">47,000+</div>
            <div className="text-sm text-text-muted">Active Tenders</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text mb-2">$3.2B</div>
            <div className="text-sm text-text-muted">Contract Value</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2,847</div>
            <div className="text-sm text-text-muted">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-success mb-2">95%</div>
            <div className="text-sm text-text-muted">Time Saved</div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-accent/30 transition-colors">
          <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-4">
            <Target className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-text mb-3">
            Smart Matching
          </h3>
          <p className="text-text-muted leading-relaxed">
            AI analyzes thousands of contracts to find opportunities that fit
            your experience, capabilities, and business size.
          </p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-maple/30 transition-colors">
          <div className="inline-flex p-4 bg-maple/10 rounded-xl mb-4">
            <MapPin className="w-8 h-8 text-maple" />
          </div>
          <h3 className="text-xl font-semibold text-text mb-3">
            Coast to Coast
          </h3>
          <p className="text-text-muted leading-relaxed">
            Access opportunities from federal, provincial, and municipal
            governments across all Canadian jurisdictions in one place.
          </p>
        </div>

        <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-success/30 transition-colors">
          <div className="inline-flex p-4 bg-success/10 rounded-xl mb-4">
            <Timer className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-semibold text-text mb-3">Save Time</h3>
          <p className="text-text-muted leading-relaxed">
            Stop manually checking dozens of procurement portals. Get instant
            alerts when new relevant opportunities are published.
          </p>
        </div>
      </div>  
    </section>
  );
}
