import {
  Lightning,
  Target,
  Clock,
  ChartBar,
  MapPin,
  CurrencyDollar,
} from "@phosphor-icons/react";

export default function KeyFeaturesSection() {
  return (
    <section className="min-h-screen flex items-center py-32 px-6 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto w-full">
        {/* Split Header */}
        <div className="grid md:grid-cols-3 gap-16 mb-32">
          <div className="md:col-span-2">
            <h2 className="text-8xl font-light mb-8 text-text leading-[0.8]">
              Everything your
              <br />
              business needs to
            </h2>
          </div>
          <div className="flex items-end">
            <div>
              <h2 className="text-6xl font-bold text-primary mb-4">win more</h2>
              <h2 className="text-4xl font-bold text-text">contracts</h2>
              <p className="text-lg text-text-light mt-4">
                Enterprise-grade procurement intelligence platform
              </p>
            </div>
          </div>
        </div>

        {/* Asymmetric Feature Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Large Feature - Spans 8 columns */}
          <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-16 min-h-[400px] flex flex-col justify-between">
            <div>
              <Lightning className="w-20 h-20 mb-8 opacity-90" />
              <h3 className="text-5xl font-bold mb-6 leading-tight">
                AI-Powered Discovery
              </h3>
              <p className="text-xl leading-relaxed opacity-90">
                Describe your business capabilities in natural language. Our
                enterprise AI understands context, industry nuance, and finds
                contracts that align with your strategic objectives.
              </p>
            </div>
            <div className="text-right mt-8">
              <div className="text-3xl font-bold opacity-90">95%</div>
              <div className="text-sm opacity-75">ACCURACY RATE</div>
            </div>
          </div>

          {/* Small Feature - Spans 4 columns */}
          <div className="col-span-12 md:col-span-4 bg-background border border-border rounded-3xl p-12 min-h-[400px] flex flex-col">
            <Target className="w-16 h-16 text-primary mb-8" />
            <h3 className="text-2xl font-semibold mb-6 text-text">
              Intelligent Notifications
            </h3>
            <p className="text-lg text-text-light leading-relaxed flex-grow">
              Automated alerts keep your team informed the moment relevant
              opportunities are posted.
            </p>
          </div>

          {/* Medium Feature - Spans 6 columns */}
          <div className="col-span-12 md:col-span-6 bg-background border border-border rounded-3xl p-12 min-h-[350px] flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <Clock className="w-16 h-16 text-primary" />
              <div>
                <h3 className="text-3xl font-semibold text-text">
                  Pipeline Management
                </h3>
                <div className="text-sm text-text-light uppercase tracking-wider">
                  NEVER MISS DEADLINES
                </div>
              </div>
            </div>
            <p className="text-lg text-text-light leading-relaxed flex-grow">
              Automated workflow management with integrated calendar sync and
              milestone tracking.
            </p>
          </div>

          {/* Medium Feature - Spans 6 columns */}
          <div className="col-span-12 md:col-span-6 bg-accent/10 border border-accent/30 rounded-3xl p-12 min-h-[350px] flex flex-col">
            <ChartBar className="w-16 h-16 text-accent mb-8" />
            <h3 className="text-3xl font-semibold mb-6 text-text">
              Business Intelligence
            </h3>
            <p className="text-lg text-text-light leading-relaxed flex-grow">
              Advanced AI analyzes your company profile against contract
              requirements to prioritize opportunities.
            </p>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-accent/20">
              <span className="text-sm text-text-light uppercase tracking-wider">
                ROI Impact
              </span>
              <span className="text-2xl font-bold text-accent">+340%</span>
            </div>
          </div>

          {/* Wide Feature - Spans 7 columns */}
          <div className="col-span-12 md:col-span-7 bg-background border border-border rounded-3xl p-12 min-h-[300px] flex items-center">
            <div className="flex items-center gap-8 w-full">
              <MapPin className="w-20 h-20 text-primary flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="text-4xl font-semibold mb-4 text-text">
                  Market Intelligence Platform
                </h3>
                <p className="text-lg text-text-light leading-relaxed">
                  Comprehensive geographic and market analysis. Smart territory
                  mapping and regional opportunity intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Small Feature - Spans 5 columns */}
          <div className="col-span-12 md:col-span-5 bg-success/10 border border-success/30 rounded-3xl p-12 min-h-[300px] flex flex-col justify-center text-center">
            <CurrencyDollar className="w-16 h-16 text-success mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4 text-text">
              Enterprise Filtering
            </h3>
            <p className="text-lg text-text-light leading-relaxed">
              Focus resources on high-value opportunities within your
              operational capacity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
