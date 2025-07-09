import { useCallback, useState } from "react";
import {
  MagnifyingGlass,
  Target,
  ChartBar,
  ArrowsClockwise,
  Lightning,
  CheckCircle,
  Users,
  MapPin,
  CalendarCheck,
  CurrencyDollar,
  Clock,
  Eye,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { filterOpenTenderNotices } from "../api";
import WelcomeBanner from "../components/WelcomeBanner";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function LandingPage() {
  const [showBanner, setShowBanner] = useState(
    localStorage.getItem("maplebids:welcomeBannerClosed") !== "true"
  );
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

  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem("maplebids:welcomeBannerClosed", "true");
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {showBanner && <WelcomeBanner closeBanner={handleCloseBanner} />}
      {/* Hero Section - Dynamic Layout */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 bg-background py-24">
        <div className="text-center max-w-7xl mx-auto mb-16">
          {/* Logo and Platform Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <LogoTitle size="text-xl" />
            <span className="text-base text-text-light font-medium">
              procurement platform
            </span>
          </div>

          <h1 className="text-9xl font-bold mb-6 text-text leading-[0.9] tracking-tight">
            Built for businesses,
            <br />
            designed to <span className="italic text-primary">scale</span>
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
                        <h3 className="font-semibold text-lg">
                          {result.title}
                        </h3>
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
          {/* INSERT VIDEO: Product demo video showing MapleTenders in action - AI search, instant results, smart filtering, and how businesses find and win government contracts. Should be professional, modern, and showcase the key value proposition of operational efficiency and business intelligence. Video should be 2-3 minutes, high quality, with clear narration explaining the platform's enterprise benefits and ROI. */}
          <div className="w-full h-[500px] bg-gradient-to-br from-primary to-primary-dark rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="text-center text-white">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-2"></div>
              </div>
              <p className="text-2xl font-medium">Product Demo Video</p>
              <p className="text-lg opacity-90 mt-2">
                See MapleTenders in Action
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section - Asymmetric Layout */}
      <section className="min-h-screen flex items-center py-32 px-6 border-t border-border bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          {/* Diagonal Split Layout */}
          <div className="grid md:grid-cols-2 gap-24 items-center mb-32">
            <div className="text-left">
              <h2 className="text-9xl font-light mb-8 text-text leading-[0.8] tracking-tighter">
                Loved by
                <br />
                <span className="text-7xl text-primary font-black">
                  thousands
                </span>
              </h2>
              <p className="text-2xl text-text-light max-w-lg leading-relaxed font-light">
                Join businesses winning more government contracts with
                AI-powered intelligence
              </p>
            </div>

            <div className="text-right">
              <div className="space-y-8">
                <div className="inline-block">
                  <div className="text-8xl font-bold text-success mb-2">
                    47K+
                  </div>
                  <div className="text-lg text-text-light uppercase tracking-wider">
                    Active Tenders
                  </div>
                </div>
                <div className="inline-block ml-16">
                  <div className="text-6xl font-bold text-text mb-2">$3.2B</div>
                  <div className="text-lg text-text-light uppercase tracking-wider">
                    Contract Value
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats Cards */}
          <div className="relative">
            <div className="absolute top-0 left-1/4 transform -translate-x-1/2 -translate-y-4">
              <div className="bg-background border-2 border-primary rounded-2xl p-8 shadow-2xl">
                <div className="text-4xl font-bold text-text mb-2">2,847</div>
                <div className="text-sm text-text-light">Active Users</div>
              </div>
            </div>
            <div className="absolute top-12 right-1/4 transform translate-x-1/2">
              <div className="bg-primary text-white rounded-2xl p-8 shadow-2xl">
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-sm opacity-90">Time Saved</div>
              </div>
            </div>
          </div>

          {/* INSERT IMAGE: Customer awards and logos grid showing various badges like "Leader Fall 2024", "Easiest Admin Enterprise", "Top 50 Project Management Products", etc. arranged in a modern grid layout similar to monday.com's customer validation section. Should include recognizable industry awards, certifications, and customer logos in a professional, trust-building layout. Mix of badges, logos, and award certificates in a visually appealing grid. */}
          <div className="h-80 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl flex items-center justify-center mt-32 border border-primary/20">
            <div className="text-center">
              <p className="text-2xl font-medium text-text mb-2">
                Customer Awards & Industry Recognition Grid
              </p>
              <p className="text-lg text-text-light">
                Trusted by leading organizations across Canada
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section - Zigzag Layout */}
      <section className="min-h-screen flex items-center py-32 px-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Top Text - Center but Offset */}
          <div className="max-w-5xl ml-auto mr-16 mb-32">
            <h2 className="text-9xl font-light mb-8 text-text leading-[0.8] text-right">
              Government
              <br />
              procurement
              <br />
              <span className="text-primary font-black text-7xl">
                is broken
              </span>
            </h2>
            <p className="text-2xl text-text-light leading-relaxed text-right">
              Businesses waste 60% of their procurement team's time
              <br />
              searching through irrelevant tenders
            </p>
          </div>

          {/* Split Image Layout */}
          <div className="grid md:grid-cols-2 gap-16 mb-32">
            <div className="order-2 md:order-1">
              {/* INSERT IMAGE: Split screen comparison showing a frustrated business team on the left side surrounded by stacks of papers, multiple browser tabs, and complex government forms vs. a productive, efficient team on the right using MapleTenders on clean laptops with clear, relevant results. The left side should convey operational chaos and inefficiency, while the right side shows streamlined business processes and team collaboration. High-quality photography or professional illustration. */}
              <div className="w-full h-96 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl flex items-center justify-center border-2 border-red-300">
                <span className="text-red-700 text-xl font-medium text-center">
                  Before: Business Operations Chaos
                  <br />
                  <span className="text-lg">
                    Frustrated teams, stacks of papers, confusion
                  </span>
                </span>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center border-2 border-green-300">
                <span className="text-green-700 text-xl font-medium text-center">
                  After: Streamlined Operations
                  <br />
                  <span className="text-lg">
                    Productive teams, clear insights, efficiency
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Text - Left Aligned */}
          <div className="max-w-4xl ml-16">
            <h3 className="text-6xl font-light mb-8 text-text leading-tight">
              MapleTenders transforms
              <br />
              <span className="text-primary font-bold">
                business operations
              </span>
              <br />
              with AI
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              Our enterprise-grade AI understands your business capabilities and
              delivers precision-matched opportunities to accelerate growth
            </p>
          </div>
        </div>
      </section>

      {/* Table Comparison - Government Portal vs MapleTenders UI */}
      <section className="min-h-screen flex items-center py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-32">
            <h2 className="text-7xl font-light mb-16 text-text leading-tight">
              Compare the table views
              <br />
              <span className="text-primary font-bold">side by side</span>
            </h2>
            <p className="text-3xl text-text-light max-w-4xl mx-auto">
              See how MapleTenders transforms cluttered government data into
              actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Government Portal Figure */}
            <div className="bg-background border border-border rounded-3xl p-12 text-center">
              <h3 className="text-4xl font-semibold mb-6 text-text">
                Government Portal Interface
              </h3>
              <div className="text-lg text-red-600 font-semibold mb-12">
                ❌ Overwhelming & Unclear
              </div>

              {/* INSERT IMAGE: Screenshot of actual government procurement portal table showing cluttered, hard-to-read data with dozens of columns, tiny text, confusing abbreviations, and poor visual hierarchy. Should show the overwhelming nature of raw government data presentation from sites like BuyandSell.gc.ca, MERX, or SAP Ariba. */}
              <div className="w-full h-96 bg-red-100 border-2 border-red-200 rounded-2xl flex items-center justify-center mb-12">
                <div className="text-center text-red-700">
                  <div className="text-2xl font-medium mb-2">
                    Government Portal Screenshot
                  </div>
                  <div className="text-lg">Dense, cluttered, hard to scan</div>
                </div>
              </div>
            </div>

            {/* MapleTenders Figure */}
            <div className="bg-background border border-border rounded-3xl p-12 text-center">
              <h3 className="text-4xl font-semibold mb-6 text-text">
                MapleTenders Interface
              </h3>
              <div className="text-lg text-success font-semibold mb-12">
                ✅ Clean & Actionable
              </div>

              {/* INSERT IMAGE: Screenshot of MapleTenders table interface showing clean, modern design with clear typography, color-coded relevance scores, smart column layouts, and intuitive visual hierarchy. Should emphasize the professional, user-friendly presentation of the same procurement data. */}
              <div className="w-full h-96 bg-green-100 border-2 border-green-200 rounded-2xl flex items-center justify-center mb-12">
                <div className="text-center text-green-700">
                  <div className="text-2xl font-medium mb-2">
                    MapleTenders Screenshot
                  </div>
                  <div className="text-lg">Clean, focused, easy to scan</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pros and Cons Comparison */}
          <div className="mt-20 grid md:grid-cols-2 gap-16">
            {/* Government Portal Cons */}
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-12">
              <h4 className="text-3xl font-semibold mb-8 text-text text-center">
                Government Portal Problems
              </h4>
              <ul className="space-y-6 text-xl">
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    Cryptic abbreviations and reference codes
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    Truncated titles with missing context
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    No relevance scoring or prioritization
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    Information overload - too many columns
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    Tiny text that's hard to scan quickly
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                  <span className="text-text">
                    Poor visual hierarchy and design
                  </span>
                </li>
              </ul>
            </div>

            {/* MapleTenders Pros */}
            <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-12">
              <h4 className="text-3xl font-semibold mb-8 text-text text-center">
                MapleTenders Advantages
              </h4>
              <ul className="space-y-6 text-xl">
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    Clear, readable titles and descriptions
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    AI relevance scoring for each opportunity
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    Visual icons and intuitive layout
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    Smart column design - only what you need
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    Scannable at a glance with proper spacing
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                  <span className="text-text">
                    Modern, professional interface design
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Stats Comparison */}
          <div className="mt-20 bg-surface border border-border rounded-3xl p-12">
            <h4 className="text-3xl font-semibold text-center mb-12 text-text">
              The User Experience Difference
            </h4>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-4 text-success">5x</div>
                <div className="text-xl text-text-light">
                  Faster to scan results
                </div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-4 text-success">90%</div>
                <div className="text-xl text-text-light">Less eye strain</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-4 text-success">100%</div>
                <div className="text-xl text-text-light">
                  Relevance transparency
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="min-h-screen flex items-center py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-32">
            <h2 className="text-7xl font-light mb-12 text-text leading-tight">
              Built for every type
              <br />
              <span className="text-primary font-bold">of business</span>
            </h2>
            <p className="text-3xl text-text-light max-w-4xl mx-auto">
              Whether you're a small business or enterprise organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
              <div className="flex justify-center mb-12">
                <Users className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-4xl font-semibold mb-8 text-text">
                Small Businesses
              </h3>
              <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
                Agile teams and growing companies competing for contracts under
                $100K
              </p>
              <ul className="text-xl space-y-6 text-left">
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Find niche opportunities others miss
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Compete on expertise, not resources
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Quick setup, immediate results
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
              <div className="flex justify-center mb-12">
                <Target className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-4xl font-semibold mb-8 text-text">
                Growing Companies
              </h3>
              <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
                Established businesses ready to scale with larger government
                contracts
              </p>
              <ul className="text-xl space-y-6 text-left">
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Track multiple opportunities
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Team collaboration features
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Pipeline management tools
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border rounded-3xl p-16 text-center min-h-[600px] flex flex-col">
              <div className="flex justify-center mb-12">
                <ChartBar className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-4xl font-semibold mb-8 text-text">
                Enterprise Organizations
              </h3>
              <p className="text-xl mb-12 text-text-light leading-relaxed flex-grow">
                Large organizations managing complex procurement strategies
              </p>
              <ul className="text-xl space-y-6 text-left">
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Advanced analytics & reporting
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Multi-user access controls
                </li>
                <li className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success flex-shrink-0" />
                  Custom integrations available
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Creative Grid Layout */}
      <section className="min-h-screen flex items-center py-32 px-6 border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto w-full">
          {/* Split Header */}
          <div className="grid md:grid-cols-3 gap-16 mb-32">
            <div className="md:col-span-2">
              <h2 className="text-8xl font-light mb-8 text-text leading-[0.8]">
                Everything your
                <br />
                business needs to
              </h2>
            </div>
            <div className="flex items-end">
              <div>
                <h2 className="text-6xl font-bold text-primary mb-4">
                  win more
                </h2>
                <h2 className="text-4xl font-bold text-text">contracts</h2>
                <p className="text-lg text-text-light mt-4">
                  Enterprise-grade procurement intelligence platform
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetric Feature Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Large Feature - Spans 8 columns */}
            <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-16 min-h-[400px] flex flex-col justify-between">
              <div>
                <Lightning className="w-20 h-20 mb-8 opacity-90" />
                <h3 className="text-5xl font-bold mb-6 leading-tight">
                  AI-Powered Discovery
                </h3>
                <p className="text-xl leading-relaxed opacity-90">
                  Describe your business capabilities in natural language. Our
                  enterprise AI understands context, industry nuance, and finds
                  contracts that align with your strategic objectives.
                </p>
              </div>
              <div className="text-right mt-8">
                <div className="text-3xl font-bold opacity-90">95%</div>
                <div className="text-sm opacity-75">ACCURACY RATE</div>
              </div>
            </div>

            {/* Small Feature - Spans 4 columns */}
            <div className="col-span-12 md:col-span-4 bg-background border border-border rounded-3xl p-12 min-h-[400px] flex flex-col">
              <Target className="w-16 h-16 text-primary mb-8" />
              <h3 className="text-2xl font-semibold mb-6 text-text">
                Intelligent Notifications
              </h3>
              <p className="text-lg text-text-light leading-relaxed flex-grow">
                Automated alerts keep your team informed the moment relevant
                opportunities are posted.
              </p>
            </div>

            {/* Medium Feature - Spans 6 columns */}
            <div className="col-span-12 md:col-span-6 bg-background border border-border rounded-3xl p-12 min-h-[350px] flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <Clock className="w-16 h-16 text-primary" />
                <div>
                  <h3 className="text-3xl font-semibold text-text">
                    Pipeline Management
                  </h3>
                  <div className="text-sm text-text-light uppercase tracking-wider">
                    NEVER MISS DEADLINES
                  </div>
                </div>
              </div>
              <p className="text-lg text-text-light leading-relaxed flex-grow">
                Automated workflow management with integrated calendar sync and
                milestone tracking.
              </p>
            </div>

            {/* Medium Feature - Spans 6 columns */}
            <div className="col-span-12 md:col-span-6 bg-accent/10 border border-accent/30 rounded-3xl p-12 min-h-[350px] flex flex-col">
              <ChartBar className="w-16 h-16 text-accent mb-8" />
              <h3 className="text-3xl font-semibold mb-6 text-text">
                Business Intelligence
              </h3>
              <p className="text-lg text-text-light leading-relaxed flex-grow">
                Advanced AI analyzes your company profile against contract
                requirements to prioritize opportunities.
              </p>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-accent/20">
                <span className="text-sm text-text-light uppercase tracking-wider">
                  ROI Impact
                </span>
                <span className="text-2xl font-bold text-accent">+340%</span>
              </div>
            </div>

            {/* Wide Feature - Spans 7 columns */}
            <div className="col-span-12 md:col-span-7 bg-background border border-border rounded-3xl p-12 min-h-[300px] flex items-center">
              <div className="flex items-center gap-8 w-full">
                <MapPin className="w-20 h-20 text-primary flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-4xl font-semibold mb-4 text-text">
                    Market Intelligence Platform
                  </h3>
                  <p className="text-lg text-text-light leading-relaxed">
                    Comprehensive geographic and market analysis. Smart
                    territory mapping and regional opportunity intelligence.
                  </p>
                </div>
              </div>
            </div>

            {/* Small Feature - Spans 5 columns */}
            <div className="col-span-12 md:col-span-5 bg-success/10 border border-success/30 rounded-3xl p-12 min-h-[300px] flex flex-col justify-center text-center">
              <CurrencyDollar className="w-16 h-16 text-success mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4 text-text">
                Enterprise Filtering
              </h3>
              <p className="text-lg text-text-light leading-relaxed">
                Focus resources on high-value opportunities within your
                operational capacity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section - Magazine Layout */}
      <section className="min-h-screen flex items-center py-32 px-6 border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto w-full">
          {/* Offset Header */}
          <div className="max-w-4xl ml-auto mr-8 mb-32 text-right">
            <h2 className="text-8xl font-light mb-8 text-text leading-[0.8]">
              Real results from
              <br />
              <span className="text-6xl text-primary font-black">
                real businesses
              </span>
            </h2>
            <p className="text-xl text-text-light leading-relaxed">
              See how MapleTenders is driving procurement success for
              organizations across Canada
            </p>
          </div>

          {/* Testimonial Magazine Grid */}
          <div className="grid grid-cols-12 gap-8 mb-24">
            {/* Large Featured Testimonial */}
            <div className="col-span-12 md:col-span-8 bg-primary text-white rounded-3xl p-16 min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-12">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 text-white text-2xl">
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-3xl mb-12 leading-relaxed font-light">
                  "Our procurement team went from spending 2 days a week on
                  opportunity research to 20 minutes. We identified contracts
                  worth $1.2M in our first month using the platform."
                </p>
                <div className="text-6xl font-bold mb-4">$1.2M</div>
                <div className="text-lg opacity-90">
                  CONTRACTS IDENTIFIED IN MONTH 1
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SC
                </div>
                <div className="text-xl">
                  <strong>Sarah Chen</strong>
                  <br />
                  <span className="opacity-90">
                    Business Development, TechFlow Solutions
                  </span>
                </div>
              </div>
            </div>

            {/* Stacked Small Testimonials */}
            <div className="col-span-12 md:col-span-4 space-y-8">
              <div className="bg-background border border-border rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-6 h-6 text-accent text-lg">
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-lg mb-6 text-text leading-relaxed">
                  "The AI platform understands our business capabilities and
                  market position. ROI was measurable within 30 days."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    MR
                  </div>
                  <div>
                    <strong className="text-text">Marcus Rodriguez</strong>
                    <br />
                    <span className="text-text-light text-sm">
                      CEO, Infrastructure Plus
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-6 h-6 text-accent text-lg">
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-lg mb-6 text-text leading-relaxed">
                  "Finally, an enterprise platform that understands government
                  procurement complexity."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
                    JW
                  </div>
                  <div>
                    <strong className="text-text">Jennifer Walsh</strong>
                    <br />
                    <span className="text-text-light text-sm">
                      VP Sales, DataSecure Inc.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Stats - Scattered Layout */}
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="bg-background border border-border rounded-3xl p-12 transform -rotate-1">
                <div className="text-5xl font-bold text-success mb-4">
                  $12.4M
                </div>
                <div className="text-xl text-text-light">
                  Contract value secured by clients
                </div>
              </div>
              <div className="bg-background border border-border rounded-3xl p-12 transform rotate-2">
                <div className="text-5xl font-bold text-success mb-4">340%</div>
                <div className="text-xl text-text-light">
                  Average business growth acceleration
                </div>
              </div>
              <div className="bg-background border border-border rounded-3xl p-12 transform -rotate-1">
                <div className="text-5xl font-bold text-success mb-4">95%</div>
                <div className="text-xl text-text-light">
                  Operational efficiency improvement
                </div>
              </div>
              <div className="bg-background border border-border rounded-3xl p-12 transform rotate-1">
                <div className="text-5xl font-bold text-success mb-4">
                  4.8/5
                </div>
                <div className="text-xl text-text-light">
                  Enterprise client satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Accordion with Varied Spacing */}
      <section className="min-h-screen flex items-center py-32 px-6">
        <div className="max-w-6xl mx-auto w-full">
          {/* Split Header Layout */}
          <div className="grid md:grid-cols-5 gap-16 mb-24">
            <div className="md:col-span-2">
              <h2 className="text-7xl font-black text-text leading-[0.8] mb-8">
                Frequently
                <br />
                <span className="text-primary font-light italic">asked</span>
                <br />
                questions
              </h2>
            </div>
            <div className="md:col-span-3 flex items-end">
              <p className="text-2xl text-text-light leading-relaxed">
                Everything you need to know about MapleTenders for your business
                operations
              </p>
            </div>
          </div>

          {/* Staggered FAQ Items */}
          <div className="space-y-12">
            <div className="border border-border rounded-3xl p-12 ml-0">
              <h3 className="text-3xl font-semibold mb-8 text-text">
                How accurate is the AI search?
              </h3>
              <p className="text-xl text-text-light leading-relaxed">
                Our enterprise AI has been trained on thousands of government
                procurement documents and achieves 95%+ accuracy in matching
                businesses with relevant opportunities. It understands industry
                context, technical requirements, and regulatory nuance.
              </p>
            </div>

            <div className="border border-border rounded-3xl p-12 ml-16">
              <h3 className="text-3xl font-semibold mb-8 text-text">
                Do you cover all provinces and territories?
              </h3>
              <p className="text-xl text-text-light leading-relaxed">
                Yes, we monitor federal, provincial, territorial, and municipal
                procurement opportunities across all of Canada. From major
                cities to rural communities.
              </p>
            </div>

            <div className="border border-border rounded-3xl p-12 ml-8">
              <h3 className="text-3xl font-semibold mb-8 text-text">
                How quickly are new tenders added?
              </h3>
              <p className="text-xl text-text-light leading-relaxed">
                We scan for new opportunities every hour and most tenders appear
                in your search results within 2-4 hours of being posted by the
                government agency.
              </p>
            </div>

            <div className="border border-border rounded-3xl p-12 ml-24">
              <h3 className="text-3xl font-semibold mb-8 text-text">
                Can I try it before I buy?
              </h3>
              <p className="text-xl text-text-light leading-relaxed">
                Absolutely. Begin with a 14-day enterprise trial - no credit
                card required. Experience our full platform capabilities and
                measure the operational impact on your procurement processes.
              </p>
            </div>

            <div className="border border-border rounded-3xl p-12 ml-4">
              <h3 className="text-3xl font-semibold mb-8 text-text">
                What if our team needs implementation support?
              </h3>
              <p className="text-xl text-text-light leading-relaxed">
                Every enterprise client receives dedicated onboarding and change
                management support from our customer success team. We'll
                configure your platform, train your teams, and ensure seamless
                integration with your existing workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold Asymmetric Design */}
      <section className="min-h-screen flex items-center py-32 px-6 bg-gradient-to-br from-surface via-primary/5 to-accent/5 border-t border-border overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative">
          {/* Background Geometric Elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl"></div>

          {/* Split Layout */}
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-9xl font-light mb-12 text-text leading-[0.75] tracking-tighter">
                Stop
                <br />
                missing
                <br />
                <span className="text-primary font-black text-7xl">
                  opportunities
                </span>
              </h2>

              {/* Action Buttons - Stacked */}
              <div className="space-y-6 mb-16">
                <button
                  onClick={() => navigate("/sign-up")}
                  className="w-full px-16 py-8 bg-primary text-white border border-primary text-2xl font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-primary-dark transition-all transform hover:scale-105 shadow-2xl"
                >
                  <Lightning className="w-8 h-8" />
                  Start Free Trial
                </button>
                <button className="w-full px-16 py-8 border-2 border-border text-text text-2xl font-medium rounded-2xl flex items-center justify-center gap-4 hover:bg-background transition-all shadow-lg">
                  <Users className="w-8 h-8" />
                  Book Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <span className="text-xl text-text-light">
                    14-day free trial
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <span className="text-xl text-text-light">No setup fees</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                  <span className="text-xl text-text-light">
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right space-y-8">
              <p className="text-3xl text-text-light leading-relaxed font-light">
                Join hundreds of Canadian
                <br />
                businesses using AI-powered
                <br />
                procurement intelligence to
                <br />
                <span className="text-text font-medium">accelerate growth</span>
              </p>

              {/* Floating Stats */}
              <div className="space-y-6">
                <div className="inline-block bg-background border border-border rounded-2xl p-8 shadow-lg transform rotate-2">
                  <div className="text-4xl font-bold text-success mb-2">
                    340%
                  </div>
                  <div className="text-sm text-text-light uppercase tracking-wider">
                    GROWTH RATE
                  </div>
                </div>
                <div className="block">
                  <div className="inline-block bg-primary text-white rounded-2xl p-8 shadow-lg transform -rotate-1">
                    <div className="text-4xl font-bold mb-2">$12.4M</div>
                    <div className="text-sm opacity-90 uppercase tracking-wider">
                      SECURED
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof Badge */}
              <div className="inline-block bg-accent/10 border border-accent/30 rounded-2xl p-6 mt-8">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-6 h-6 text-accent text-lg">
                      ★
                    </div>
                  ))}
                </div>
                <div className="text-lg font-semibold text-text">
                  4.8/5 Enterprise Rating
                </div>
                <div className="text-sm text-text-light">
                  From 200+ business reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
