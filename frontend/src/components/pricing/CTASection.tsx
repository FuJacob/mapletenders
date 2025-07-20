import { useNavigate } from "react-router-dom";
import { Lightning, Phone, Leaf, MapPin } from "@phosphor-icons/react";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export default function CTASection({ isAuthenticated }: CTASectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 text-center border-t border-border-warm bg-gradient-to-br from-surface-warm to-surface relative overflow-hidden">
      {/* Background Canadian Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-8 right-8">
          <Leaf className="w-16 h-16 text-maple transform rotate-12" />
        </div>
        <div className="absolute bottom-8 left-8">
          <MapPin className="w-12 h-12 text-accent transform -rotate-12" />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-full text-sm font-medium mb-6">
          <Leaf className="w-4 h-4" />
          Join the Canadian Advantage
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text">
          Ready to Win More <span className="text-accent">Canadian</span> Contracts?
        </h2>
        <p className="text-lg text-text-muted mb-8 leading-relaxed">
          Join thousands of Canadian businesses using Mapletenders to discover opportunities 
          across all provinces and territories.
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
            className="px-8 py-4 bg-gradient-to-r from-accent to-maple text-white text-lg font-medium rounded-lg flex items-center gap-2 hover:from-accent/90 hover:to-maple/90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Lightning className="w-5 h-5" />
            {isAuthenticated ? "Choose Your Plan" : "Start Free Trial"}
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-4 border border-border-warm text-text text-lg rounded-lg flex items-center gap-2 hover:bg-surface-warm hover:border-accent transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Phone className="w-5 h-5" />
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}