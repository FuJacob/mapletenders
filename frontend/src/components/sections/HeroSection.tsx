import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  ArrowsClockwise,
  CheckCircle,
  ArrowRight,
  Leaf,
  MapPin,
  Timer,
  Target,
} from "@phosphor-icons/react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    console.log("Searching for:", searchQuery);
    setTimeout(() => setIsSearching(false), 2000);
  }, [searchQuery]);

  return (
    <section className="relative py-24 px-6 bg-surface overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-8">
            <Leaf className="w-4 h-4" />
            Canada's #1 Procurement Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-text leading-tight">
            Win More Government
            <br />
            <span className="text-accent">Contracts</span>
          </h1>
          
          <p className="text-xl text-text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
            Stop searching dozens of procurement sites. Our AI finds opportunities across all Canadian jurisdictions that perfectly match your business capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => navigate("/sign-up")}
              className="px-8 py-4 bg-accent text-white font-semibold text-lg rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate("/pricing")}
              className="px-8 py-4 border-2 border-border-warm text-text font-semibold text-lg rounded-lg hover:bg-surface-warm hover:border-accent transition-colors"
            >
              View Pricing
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-text-muted mb-12 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>500+ Canadian businesses</span>
            </div>
          </div>

          {/* Demo search */}
          <div className="max-w-2xl mx-auto mb-16">
            <p className="text-sm text-text-muted mb-4">Try searching for opportunities:</p>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 'IT consulting services under $100K in Ontario'"
                className="w-full px-6 py-4 text-base border-2 border-border-warm rounded-xl focus:outline-none focus:border-accent bg-surface text-text placeholder-text-muted shadow-sm"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-3 bottom-3 px-6 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
                disabled={isSearching}
              >
                {isSearching ? (
                  <ArrowsClockwise className="w-4 h-4 animate-spin" />
                ) : (
                  <MagnifyingGlass className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Value props grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-accent/30 transition-colors">
            <div className="inline-flex p-4 bg-accent/10 rounded-xl mb-4">
              <Target className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">Smart Matching</h3>
            <p className="text-text-muted leading-relaxed">AI analyzes thousands of contracts to find opportunities that fit your experience, capabilities, and business size.</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-maple/30 transition-colors">
            <div className="inline-flex p-4 bg-maple/10 rounded-xl mb-4">
              <MapPin className="w-8 h-8 text-maple" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">Coast to Coast</h3>
            <p className="text-text-muted leading-relaxed">Access opportunities from federal, provincial, and municipal governments across all Canadian jurisdictions in one place.</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-surface-warm border border-border-warm hover:border-success/30 transition-colors">
            <div className="inline-flex p-4 bg-success/10 rounded-xl mb-4">
              <Timer className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-3">Save Time</h3>
            <p className="text-text-muted leading-relaxed">Stop manually checking dozens of procurement portals. Get instant alerts when new relevant opportunities are published.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
