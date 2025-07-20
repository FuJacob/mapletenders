import {
  Lightning,
  Clock,
  ChartBar,
  Leaf,
  MapPin,
  Bell,
  Shield,
  ArrowRight,
} from "@phosphor-icons/react";

export default function KeyFeaturesSection() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-3 h-3" />
            Built for Canadian contractors
          </div>
          <h2 className="text-4xl font-bold text-text mb-6">
            Everything you need to win more contracts
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Powerful tools designed specifically for navigating Canadian government procurement at all levels.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* AI-Powered Matching */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-accent/30 transition-colors group">
            <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-6 group-hover:bg-accent/20 transition-colors">
              <Lightning className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              AI-Powered Matching
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Our AI learns your business capabilities and automatically finds contracts that match your experience, size, and specialties.
            </p>
            <div className="flex items-center gap-2 text-sm text-accent font-medium">
              Learn more <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* All Canadian Jurisdictions */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-maple/30 transition-colors group">
            <div className="inline-flex p-4 bg-maple/10 rounded-xl mb-6 group-hover:bg-maple/20 transition-colors">
              <MapPin className="w-8 h-8 text-maple" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              All Canadian Jurisdictions
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Access opportunities from federal, provincial, territorial, and municipal governments across Canada in one unified platform.
            </p>
            <div className="flex items-center gap-2 text-sm text-maple font-medium">
              View coverage <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Smart Alerts */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-warning/30 transition-colors group">
            <div className="inline-flex p-4 bg-warning/10 rounded-xl mb-6 group-hover:bg-warning/20 transition-colors">
              <Bell className="w-8 h-8 text-warning" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              Smart Alerts
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Custom alerts ensure you never miss opportunities. Set criteria and get instant notifications when relevant contracts are posted.
            </p>
            <div className="flex items-center gap-2 text-sm text-warning font-medium">
              Set up alerts <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Deadline Management */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-success/30 transition-colors group">
            <div className="inline-flex p-4 bg-success/10 rounded-xl mb-6 group-hover:bg-success/20 transition-colors">
              <Clock className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              Deadline Tracking
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Never miss a submission deadline. Track all your opportunities with automated reminders and calendar integration.
            </p>
            <div className="flex items-center gap-2 text-sm text-success font-medium">
              Track deadlines <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Competition Analysis */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-info/30 transition-colors group">
            <div className="inline-flex p-4 bg-info/10 rounded-xl mb-6 group-hover:bg-info/20 transition-colors">
              <ChartBar className="w-8 h-8 text-info" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              Competition Analysis
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Understand the competitive landscape. See bid patterns, success rates, and strategic insights to improve your win rate.
            </p>
            <div className="flex items-center gap-2 text-sm text-info font-medium">
              View analytics <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Secure & Compliant */}
          <div className="bg-surface-warm border border-border-warm rounded-2xl p-8 hover:border-primary/30 transition-colors group">
            <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6 group-hover:bg-primary/20 transition-colors">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">
              Secure & Compliant
            </h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Built with Canadian privacy standards in mind. Your business data is secure and never shared with competitors.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary font-medium">
              Security details <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent/90 transition-colors shadow-lg">
            Try All Features Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-sm text-text-muted mt-4">14-day trial • No credit card required</p>
        </div>
      </div>
    </section>
  );
}
