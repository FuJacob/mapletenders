import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass,
  ArrowsClockwise,
  CheckCircle,
  ArrowRight,
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
    <section className="py-20 px-6 bg-bg">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-text-muted rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            AI-Powered Canadian Procurement Platform
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-text leading-tight">
          Find government contracts
          <br />
          <span className="text-primary">that match your business</span>
        </h1>
        
        <p className="text-lg text-text-muted mb-10 max-w-2xl mx-auto">
          Stop wasting time on irrelevant tenders. Our AI finds Canadian government contracts perfectly suited to your capabilities.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button 
            onClick={() => navigate("/sign-up")}
            className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Start free trial
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="px-8 py-3 border border-border text-text font-medium rounded-lg hover:bg-surface-muted transition-colors">
            Watch demo
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-text-muted mb-12">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Free 14-day trial
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            No credit card required
          </span>
        </div>

        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try: 'IT services under $50K in Ontario'"
            className="w-full px-5 py-4 text-base border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-md font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
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
    </section>
  );
}
