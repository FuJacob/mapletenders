import { useNavigate } from "react-router-dom";
import {
  Lightning,
  CheckCircle,
  Users,
  TrendUp,
  CurrencyDollar,
  Star,
} from "@phosphor-icons/react";

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center py-32 px-6 bg-gradient-to-br from-surface via-primary/5 to-accent/5 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto w-full relative">
        {/* Background Geometric Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>

        {/* Split Layout */}
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-9xl font-light mb-12 text-text leading-[0.75] tracking-tighter">
              Stop
              <br />
              missing
              <br />
              <span className="text-primary font-black text-7xl">
                opportunities
              </span>
            </h2>

            {/* Action Buttons - Stacked */}
            <div className="space-y-6 mb-16">
              <button
                onClick={() => navigate("/sign-up")}
                className="w-full px-16 py-8 bg-primary text-white border border-primary text-2xl font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-primary-dark transition-all transform hover:scale-105 shadow-2xl"
              >
                <Lightning className="w-8 h-8" />
                Start Free Trial
              </button>
              <button className="w-full px-16 py-8 border-2 border-border text-text text-2xl font-medium rounded-2xl flex items-center justify-center gap-4 hover:bg-background transition-all shadow-lg">
                <Users className="w-8 h-8" />
                Book Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success" />
                <span className="text-xl text-text-light">
                  14-day free trial
                </span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success" />
                <span className="text-xl text-text-light">No setup fees</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-success" />
                <span className="text-xl text-text-light">Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-8">
            <p className="text-3xl text-text-light leading-relaxed font-light">
              Join hundreds of Canadian
              <br />
              businesses using AI-powered
              <br />
              procurement intelligence to
              <br />
              <span className="text-text font-medium">accelerate growth</span>
            </p>

            {/* Floating Stats */}
            <div className="space-y-6">
              <div className="inline-block bg-background border border-border rounded-2xl p-8 shadow-lg transform rotate-2">
                <div className="flex items-center gap-3 mb-2">
                  <TrendUp className="w-8 h-8 text-success" />
                  <div className="text-4xl font-bold text-success">340%</div>
                </div>
                <div className="text-sm text-text-light uppercase tracking-wider">
                  GROWTH RATE
                </div>
              </div>
              <div className="block">
                <div className="inline-block bg-primary text-white rounded-2xl p-8 shadow-lg transform -rotate-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CurrencyDollar className="w-8 h-8 text-white" />
                    <div className="text-4xl font-bold">$12.4M</div>
                  </div>
                  <div className="text-sm opacity-90 uppercase tracking-wider">
                    SECURED
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof Badge */}
            <div className="inline-block bg-accent/10 border border-accent/30 rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-accent" weight="fill" />
                ))}
              </div>
              <div className="text-lg font-semibold text-text">
                4.8/5 Enterprise Rating
              </div>
              <div className="text-sm text-text-light">
                From 200+ business reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
