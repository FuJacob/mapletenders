import { useState } from "react";
import {
  MagnifyingGlass,
  Target,
  ChartBar,
  ArrowsClockwise,
  Lightning,
  CheckCircle,
  Users,
  TrendUp,
  MapPin,
  CalendarCheck,
  CurrencyDollar,
  Robot,
  Clock,
  Star,
  Eye,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { filterOpenTenderNotices } from "../api";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate search delay
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    const response = await filterOpenTenderNotices(searchQuery);
    console.log("SEARCHING" + searchQuery);
    console.log("RESPONSE", response);

    setTimeout(() => setIsSearching(false), 2000);
  };

  const exampleQueries = [
    "IT infrastructure projects in Ontario under $250K",
    "Construction contracts in Vancouver due next month",
    "Healthcare equipment procurement across Canada",
    "Professional services for government agencies",
    "Cybersecurity consulting opportunities in Toronto",
  ];

  const mockResults = [
    {
      title: "IT Infrastructure Modernization - Health Canada",
      value: "$185,000",
      deadline: "Aug 15, 2025",
      location: "Ottawa, ON",
      relevance: "98%",
    },
    {
      title: "Network Security Assessment - Transport Canada",
      value: "$142,000",
      deadline: "Aug 22, 2025",
      location: "Toronto, ON",
      relevance: "95%",
    },
    {
      title: "Cloud Migration Services - ESDC",
      value: "$230,000",
      deadline: "Sep 5, 2025",
      location: "Gatineau, QC",
      relevance: "92%",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search Section */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 bg-background">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-4 text-text">
            Ask for any
            <br />
            <span className="italic text-primary">government tender</span>
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-text-light">
            Stop scrolling through endless procurement lists. Just describe what
            you're looking for.
          </p>

          {/* Main Search Interface */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., IT contracts in Toronto under $100K"
                className="w-full p-6 text-lg border-2 border-border rounded-2xl pr-16 focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
              />
              <button
                onClick={handleSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                disabled={isSearching}
              >
                {isSearching ? (
                  <ArrowsClockwise className="w-4 h-4 animate-spin" />
                ) : (
                  <MagnifyingGlass className="w-4 h-4" />
                )}
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {/* Live Search Results */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-4 border rounded-2xl p-6 bg-white shadow-lg">
                <div className="text-sm mb-4">Found 847 relevant tenders</div>
                <div className="space-y-4">
                  {mockResults.map((result, i) => (
                    <div
                      key={i}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">
                          {result.title}
                        </h3>
                        <span className="text-xs border px-2 py-1 rounded">
                          {result.relevance} match
                        </span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex gap-4 items-center">
                          <span className="flex items-center gap-1">
                            <CurrencyDollar className="w-3 h-3" />
                            {result.value}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {result.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarCheck className="w-3 h-3" />
                            Due {result.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button className="text-sm underline flex items-center gap-1 mx-auto">
                    <Eye className="w-4 h-4" />
                    View all 847 results →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Example Queries */}
          <div className="text-center">
            <p className="text-sm mb-4 text-text-light">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {exampleQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => setSearchQuery(query)}
                  className="px-4 py-2 text-xs border border-border rounded-full hover:bg-primary hover:text-white hover:border-primary transition-colors text-text-light"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-text">
                <Lightning className="w-8 h-8 text-accent" />
                50K+
              </div>
              <div className="text-sm text-text-light">Tenders Indexed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-text">
                <CurrencyDollar className="w-8 h-8 text-success" />
                $2.8B
              </div>
              <div className="text-sm text-text-light">
                Contract Value Tracked
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-text">
                <Target className="w-8 h-8 text-primary" />
                98%
              </div>
              <div className="text-sm text-text-light">Search Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 flex items-center justify-center gap-2 text-text">
                <Clock className="w-8 h-8 text-secondary" />
                24/7
              </div>
              <div className="text-sm">Real-time Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Actually Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            This isn't just keyword search
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h3 className="text-2xl font-semibold mb-6">
                Traditional Search vs. MapleBids
              </h3>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="text-sm mb-2">❌ Old Way:</div>
                  <div className="font-mono text-xs p-2 border rounded">
                    keyword: "software" AND location: "toronto" AND value:
                    "&lt;100000"
                  </div>
                  <div className="text-xs mt-2">
                    Returns 847 results, mostly irrelevant
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="text-sm mb-2">✅ MapleBids AI:</div>
                  <div className="font-mono text-xs p-2 border rounded">
                    "I need software development help for a small project in
                    Toronto"
                  </div>
                  <div className="text-xs mt-2">
                    Returns 12 highly relevant matches
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-left">
              <h4 className="font-semibold">AI understands:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Robot className="w-4 h-4" />
                  <strong>Intent:</strong> "small project" = under $100K budget
                </li>
                <li className="flex items-center gap-2">
                  <Lightning className="w-4 h-4" />
                  <strong>Context:</strong> "development help" = programming
                  services
                </li>
                <li className="flex items-center gap-2">
                  <TrendUp className="w-4 h-4" />
                  <strong>Synonyms:</strong> Finds "IT consulting", "application
                  development"
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <strong>Geography:</strong> Includes GTA, not just Toronto
                  proper
                </li>
                <li className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" />
                  <strong>Timing:</strong> Prioritizes recent postings and
                  upcoming deadlines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Power User Features */}
      <section className="py-16 px-6 border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for professionals who win contracts
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Target className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
              <p className="text-sm mb-4">
                Get notified instantly when tenders match your exact criteria.
                No more daily manual checking.
              </p>
              <div className="text-xs border rounded p-2">
                "Alert me for IT security projects in BC, $50K-$500K, government
                agencies only"
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ChartBar className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Win Probability</h3>
              <p className="text-sm mb-4">
                AI analyzes your company profile against tender requirements to
                predict your chances.
              </p>
              <div className="text-xs border rounded p-2">
                High: 85% • Medium: 12% • Low: 3%
              </div>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <ArrowsClockwise className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto-Monitoring</h3>
              <p className="text-sm mb-4">
                Track amendments, deadline changes, and competitor activity
                automatically.
              </p>
              <div className="text-xs border rounded p-2">
                3 deadline extensions • 7 new bidders • 2 amendments today
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">
            Used by teams that close deals
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Star className="w-5 h-5 mt-1" />
                <div className="mb-4">
                  "We went from spending 2 days a week searching to 20 minutes.
                  Found contracts worth $1.2M in our first month."
                </div>
              </div>
              <div className="text-sm">
                <strong>Sarah Chen</strong>
                <br />
                Business Development, TechFlow Solutions
              </div>
            </div>

            <div className="border rounded-lg p-6 text-left">
              <div className="flex items-start gap-3 mb-4">
                <Star className="w-5 h-5 mt-1" />
                <div className="mb-4">
                  "The AI actually understands what we do. It found
                  opportunities we never would have discovered manually."
                </div>
              </div>
              <div className="text-sm">
                <strong>Marcus Rodriguez</strong>
                <br />
                CEO, Infrastructure Plus
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            Stop missing opportunities
          </h2>
          <p className="text-xl mb-8">
            Start your 14-day free trial. No credit card required.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/sign-up")}
              className="px-8 py-4 bg-primary text-white border border-primary text-lg font-medium rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Lightning className="w-5 h-5" />
              Start Free Trial
            </button>
            <button className="px-8 py-4 border border-border text-text text-lg rounded-lg flex items-center gap-2 hover:bg-surface transition-colors">
              <Users className="w-5 h-5" />
              Book Demo
            </button>
          </div>

          <div className="mt-8 text-sm flex items-center justify-center gap-6 text-text-light">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              No setup fees
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
