import {
  Lightning,
  Target,
  Clock,
  ChartBar,
} from "@phosphor-icons/react";

export default function KeyFeaturesSection() {
  return (
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-text mb-4">
            Everything you need to win contracts
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            AI-powered tools designed specifically for Canadian government procurement
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface border border-border rounded-lg p-8">
            <Lightning className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-text mb-4">
              Smart Contract Discovery
            </h3>
            <p className="text-text-muted leading-relaxed">
              Our AI analyzes your business capabilities and finds relevant government contracts across all Canadian jurisdictions.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-8">
            <Target className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-text mb-4">
              Intelligent Alerts
            </h3>
            <p className="text-text-muted leading-relaxed">
              Get notified instantly when contracts matching your criteria are posted. Never miss an opportunity again.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-8">
            <Clock className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-text mb-4">
              Deadline Management
            </h3>
            <p className="text-text-muted leading-relaxed">
              Track submission deadlines and manage your bidding pipeline with automated reminders and calendar integration.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-8">
            <ChartBar className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-text mb-4">
              Analytics & Insights
            </h3>
            <p className="text-text-muted leading-relaxed">
              Data-driven insights on win rates, market trends, and competitor analysis to improve your bidding strategy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
