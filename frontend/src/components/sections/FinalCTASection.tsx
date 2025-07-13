import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-bg">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-text mb-6">
          Ready to find better contracts faster?
        </h2>
        <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
          Join Canadian contractors who save hours every week with AI-powered procurement intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => navigate("/sign-up")}
            className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Start free trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-4 border border-border text-text font-medium rounded-lg hover:bg-surface-muted transition-colors">
            Book a demo
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-text-muted">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Free 14-day trial
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
