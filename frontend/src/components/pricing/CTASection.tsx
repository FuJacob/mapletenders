import { useNavigate } from "react-router-dom";
import { Lightning, Phone } from "@phosphor-icons/react";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export default function CTASection({ isAuthenticated }: CTASectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 text-center border-t border-border bg-surface">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-text">
          Ready to start winning?
        </h2>
        <p className="text-lg text-text-light mb-8">
          Join thousands of businesses already using MapleBids to discover and
          win government contracts.
        </p>
        <div className="flex gap-4 justify-center">
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
            className="px-8 py-4 bg-primary text-white text-lg font-medium rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
          >
            <Lightning className="w-5 h-5" />
            {isAuthenticated ? "Choose Plan" : "Start Free Trial"}
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 border border-border text-text text-lg rounded-lg flex items-center gap-2 hover:bg-background transition-colors"
          >
            <Phone className="w-5 h-5" />
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}