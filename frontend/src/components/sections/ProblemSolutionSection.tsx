import { Clock, Target, Leaf, CheckCircle, ArrowRight } from "@phosphor-icons/react";

export default function ProblemSolutionSection() {
  return (
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-3 h-3" />
            The Canadian procurement challenge
          </div>
          <h2 className="text-4xl font-bold text-text mb-6">
            Stop wasting time on manual searches
          </h2>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Canadian contractors lose valuable opportunities because procurement discovery takes too long and lacks precision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Side */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Current Process</span>
            </div>
            <h3 className="text-3xl font-bold text-text mb-6">
              The procurement search problem
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                <p className="text-text-muted">Visit dozens of different government procurement websites manually</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                <p className="text-text-muted">Scroll through thousands of irrelevant contracts and RFPs</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                <p className="text-text-muted">Miss opportunities because deadlines passed while you were searching</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-warm p-4 rounded-xl border border-border-warm text-center">
                <div className="text-2xl font-bold text-accent mb-1">15+ hrs</div>
                <div className="text-sm text-text-muted">wasted weekly on manual search</div>
              </div>
              <div className="bg-surface-warm p-4 rounded-xl border border-border-warm text-center">
                <div className="text-2xl font-bold text-accent mb-1">70%</div>
                <div className="text-sm text-text-muted">of relevant opportunities missed</div>
              </div>
            </div>
          </div>

          {/* Solution Side */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-success/10 rounded-lg">
                <Target className="w-6 h-6 text-success" />
              </div>
              <span className="text-sm font-semibold text-success uppercase tracking-wider">Mapletenders Way</span>
            </div>
            <h3 className="text-3xl font-bold text-text mb-6">
              AI-powered procurement intelligence
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-text-muted">AI analyzes all Canadian procurement sources automatically</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-text-muted">Smart matching finds contracts that fit your exact capabilities</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-text-muted">Instant alerts ensure you never miss a deadline again</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface p-4 rounded-xl border border-success/20 text-center">
                <div className="text-2xl font-bold text-success mb-1">2 min</div>
                <div className="text-sm text-text-muted">daily time investment</div>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-success/20 text-center">
                <div className="text-2xl font-bold text-success mb-1">95%</div>
                <div className="text-sm text-text-muted">more opportunities found</div>
              </div>
            </div>

            <button className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors">
              See How It Works
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
