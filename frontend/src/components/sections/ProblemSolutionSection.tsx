import { Clock, Target } from "@phosphor-icons/react";

export default function ProblemSolutionSection() {
  return (
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wide">The Problem</span>
            </div>
            <h2 className="text-3xl font-semibold text-text mb-6">
              Finding relevant contracts takes too long
            </h2>
            <p className="text-text-muted leading-relaxed mb-6">
              Canadian contractors waste hours manually searching through thousands of irrelevant government tenders. By the time you find a good match, the deadline has passed.
            </p>
            <div className="bg-secondary p-4 rounded-lg">
              <div className="text-2xl font-bold text-text mb-1">60%</div>
              <div className="text-sm text-text-muted">of procurement time wasted on search</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <Target className="w-8 h-8 text-success" />
              <span className="text-sm font-medium text-success uppercase tracking-wide">Our Solution</span>
            </div>
            <h2 className="text-3xl font-semibold text-text mb-6">
              AI finds perfect matches in seconds
            </h2>
            <p className="text-text-muted leading-relaxed mb-6">
              MapleTenders AI understands your business capabilities and automatically surfaces the most relevant Canadian government contracts. Spend your time bidding, not searching.
            </p>
            <div className="bg-surface border border-success/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-success mb-1">95%</div>
              <div className="text-sm text-text-muted">time saved on contract discovery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
