import { useState, useCallback } from "react";
import {
  MagnifyingGlass,
  ArrowsClockwise,
  CheckCircle,
  Eye,
  CurrencyDollar,
  MapPin,
  CalendarCheck,
  Play,
} from "@phosphor-icons/react";
import { filterOpenTenderNotices } from "../../api";
import { LogoTitle } from "../ui/LogoTitle";

// Static data moved outside component
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

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsSearching(true);
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    const response = await filterOpenTenderNotices(searchQuery);
    console.log("SEARCHING" + searchQuery);
    console.log("RESPONSE", response);
    setTimeout(() => setIsSearching(false), 2000);
  }, [searchQuery]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-24">
      <div className="text-center max-w-7xl mx-auto mb-16">
        {/* Logo and Platform Title */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <LogoTitle size="text-xl" />
          <span className="text-base text-text-light font-medium">
            procurement platform
          </span>
        </div>

        <h1 className="text-8xl font-semibold mb-6 text-text leading-none tracking-tighter">
          A Better Way to <span className="italic text-primary">Find</span>{" "}
          <br />
          Government Contracts
        </h1>
        <p className="text-xl mb-12 max-w-3xl mx-auto text-text-light leading-relaxed font-medium">
          Transform how your business discovers government opportunities. Our
          AI-powered platform finds contracts perfectly matched to your
          capabilities.
        </p>

        {/* Main Search Interface */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., IT contracts in Toronto under $100K"
              className="w-full p-8 text-xl border-2 border-border rounded-3xl pr-20 focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 px-8 py-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-3 text-lg"
              disabled={isSearching}
            >
              {isSearching ? (
                <ArrowsClockwise className="w-6 h-6 animate-spin" />
              ) : (
                <MagnifyingGlass className="w-6 h-6" />
              )}
              {isSearching ? "..." : "Search"}
            </button>
          </div>

          {/* Live Search Results */}
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-6 border rounded-3xl p-8 bg-white shadow-2xl z-10">
              <div className="text-lg mb-6 font-medium">
                Found 847 relevant tenders
              </div>
              <div className="space-y-6">
                {mockResults.map((result, i) => (
                  <div
                    key={i}
                    className="border rounded-2xl p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{result.title}</h3>
                      <span className="text-sm border px-3 py-1 rounded-full bg-green-50 text-green-700">
                        {result.relevance} match
                      </span>
                    </div>
                    <div className="text-sm space-y-2">
                      <div className="flex gap-6 items-center">
                        <span className="flex items-center gap-2">
                          <CurrencyDollar className="w-4 h-4" />
                          {result.value}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {result.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4" />
                          Due {result.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="text-lg underline flex items-center gap-2 mx-auto hover:text-primary transition-colors">
                  <Eye className="w-5 h-5" />
                  View all 847 results →
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-lg flex items-center justify-center gap-4 text-text-light">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            No credit card needed
          </span>
          <span className="text-border">✦</span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            14-day free trial
          </span>
        </div>
      </div>

      {/* Video Demo Section */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="w-full h-[500px] bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-2xl">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <Play className="w-10 h-10 text-white ml-1" weight="fill" />
            </div>
            <p className="text-2xl font-medium">Product Demo Video</p>
            <p className="text-lg opacity-90 mt-2">
              See MapleTenders in Action
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
