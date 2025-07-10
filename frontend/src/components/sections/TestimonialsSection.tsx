import {
  Medal,
  Star,
  CurrencyDollar,
  TrendUp,
  Lightning,
} from "@phosphor-icons/react";

export default function TestimonialsSection() {
  return (
    <section className="min-h-screen flex items-center py-32 px-6 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto w-full">
        {/* Offset Header */}
        <div className="max-w-4xl ml-auto mr-8 mb-32 text-right">
          <div className="flex items-center justify-end gap-4 mb-8">
            <Medal className="w-12 h-12 text-primary" weight="duotone" />
            <h2 className="text-8xl font-light text-text leading-[0.8]">
              Real results from
              <br />
              <span className="text-6xl text-primary font-black">
                real businesses
              </span>
            </h2>
          </div>
          <p className="text-xl text-text-light leading-relaxed">
            See how MapleTenders is driving procurement success for
            organizations across Canada
          </p>
        </div>

        {/* Testimonial Magazine Grid */}
        <div className="grid grid-cols-12 gap-8 mb-24">
          {/* Large Featured Testimonial */}
          <div className="col-span-12 md:col-span-8 bg-primary text-white rounded-3xl p-16 min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-12">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-white" weight="fill" />
                ))}
              </div>
              <p className="text-3xl mb-12 leading-relaxed font-light">
                "Our procurement team went from spending 2 days a week on
                opportunity research to 20 minutes. We identified contracts
                worth $1.2M in our first month using the platform."
              </p>
              <div className="text-6xl font-bold mb-4">$1.2M</div>
              <div className="text-lg opacity-90">
                CONTRACTS IDENTIFIED IN MONTH 1
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                SC
              </div>
              <div className="text-xl">
                <strong>Sarah Chen</strong>
                <br />
                <span className="opacity-90">
                  Business Development, TechFlow Solutions
                </span>
              </div>
            </div>
          </div>

          {/* Stacked Small Testimonials */}
          <div className="col-span-12 md:col-span-4 space-y-8">
            <div className="bg-background border border-border rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-accent" weight="fill" />
                ))}
              </div>
              <p className="text-lg mb-6 text-text leading-relaxed">
                "The AI platform understands our business capabilities and
                market position. ROI was measurable within 30 days."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  MR
                </div>
                <div>
                  <strong className="text-text">Marcus Rodriguez</strong>
                  <br />
                  <span className="text-text-light text-sm">
                    CEO, Infrastructure Plus
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/30 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-accent" weight="fill" />
                ))}
              </div>
              <p className="text-lg mb-6 text-text leading-relaxed">
                "Finally, an enterprise platform that understands government
                procurement complexity."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                  JW
                </div>
                <div>
                  <strong className="text-text">Jennifer Walsh</strong>
                  <br />
                  <span className="text-text-light text-sm">
                    VP Sales, DataSecure Inc.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Stats - Scattered Layout */}
        <div className="relative">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-background border border-border rounded-3xl p-12 transform -rotate-1">
              <CurrencyDollar className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold text-success mb-4">$12.4M</div>
              <div className="text-xl text-text-light">
                Contract value secured by clients
              </div>
            </div>
            <div className="bg-background border border-border rounded-3xl p-12 transform rotate-2">
              <TrendUp className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold text-success mb-4">340%</div>
              <div className="text-xl text-text-light">
                Average business growth acceleration
              </div>
            </div>
            <div className="bg-background border border-border rounded-3xl p-12 transform -rotate-1">
              <Lightning className="w-12 h-12 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold text-success mb-4">95%</div>
              <div className="text-xl text-text-light">
                Operational efficiency improvement
              </div>
            </div>
            <div className="bg-background border border-border rounded-3xl p-12 transform rotate-1">
              <Star
                className="w-12 h-12 text-success mx-auto mb-4"
                weight="fill"
              />
              <div className="text-5xl font-bold text-success mb-4">4.8/5</div>
              <div className="text-xl text-text-light">
                Enterprise client satisfaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
