import { Fire, Brain } from "@phosphor-icons/react";

export default function ProblemSolutionSection() {
  return (
    <section className="min-h-2/3 flex flex-col justify-center py-32 px-6 max-w-7xl mx-auto">
      {/* Top Row: BAD image + Problem Statement */}
      <div className="flex flex-col md:flex-row gap-12 mb-24 items-center">
        <div className="flex-1 h-80 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center border-2 border-red-300">
          <div className="text-red-700 text-xl font-medium text-center">
            <div className="text-2xl font-bold mb-2">
              Before: Business Operations Chaos
            </div>
            <div className="text-lg">
              Frustrated teams, stacks of papers, confusion
            </div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center justify-end gap-8">
            <h2 className="text-5xl font-extrabold text-text leading-tight mb-2">
              The Existing Process{" "}
              <span className="text-3xl font-semibold text-primary mb-2">
                is broken
              </span>
            </h2>
            <Fire size={120} className="text-red-500" weight="fill" />
          </div>
          <p className="text-xl text-text-light max-w-xl">
            Businesses waste 60% of their procurement team's time searching
            through irrelevant tenders
          </p>
        </div>
      </div>

      {/* Bottom Row: Solution Statement + GOOD image */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-8">
            <Brain size={120} className="text-primary" weight="fill" />
            <div>
              <h3 className="text-5xl font-extrabold text-text leading-tight mb-2">
                MapleTenders transforms
              </h3>
              <div className="text-3xl font-semibold text-primary mb-2">
                business operations with AI
              </div>
              <p className="text-xl text-text-light max-w-xl">
                Our enterprise-grade AI understands your business capabilities
                and delivers precision-matched opportunities to accelerate
                growth
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center border-2 border-green-300">
          <div className="text-green-700 text-xl font-medium text-center">
            <div className="text-2xl font-bold mb-2">
              After: Streamlined Operations
            </div>
            <div className="text-lg">
              Productive teams, clear insights, efficiency
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
