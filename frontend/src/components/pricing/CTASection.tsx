import { useNavigate } from "react-router-dom";
import { Lightning, Phone, Leaf } from "@phosphor-icons/react";

interface CTASectionProps {
  isAuthenticated?: boolean;
}

export default function CTASection({
  isAuthenticated = false,
}: CTASectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-6 text-center border-t border-border-warm bg-surface-warm relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-lg text-sm font-medium mb-4">
          <Leaf className="w-3 h-3" />
          Start winning more contracts today
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-text">
          Ready to grow your government business?
        </h2>
        <p className="text-lg text-text-muted mb-6 leading-relaxed max-w-2xl mx-auto">
          Join hundreds of Canadian contractors who use Mapletenders to find
          opportunities, track deadlines, and win more government contracts.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-8 max-w-xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">500+</div>
            <div className="text-sm text-text-muted">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-maple">10K+</div>
            <div className="text-sm text-text-muted">Contracts Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">14</div>
            <div className="text-sm text-text-muted">Day Free Trial</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/sign-up");
              } else {
                // Scroll to pricing cards
                document
                  .querySelector(".grid.md\\:grid-cols-2")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-8 py-4 bg-accent text-white text-lg font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-md hover:shadow-lg"
          >
            <Lightning className="w-5 h-5" />
            {isAuthenticated ? "Choose Your Plan" : "Start Free Trial"}
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 border border-border-warm text-text text-lg rounded-lg flex items-center justify-center gap-2 hover:bg-surface hover:border-accent transition-colors"
          >
            <Phone className="w-5 h-5" />
            Talk to Sales
          </button>
        </div>

        <p className="text-sm text-text-muted mt-6">
          No credit card required • Cancel anytime • Canadian support team
        </p>
      </div>
    </section>
  );
}
