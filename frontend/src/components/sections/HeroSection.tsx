import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";

export default function HeroSection() {
  const navigate = useNavigate();
  const stats = [
    { value: "47,000+", label: "Active Tenders" },
    { value: "$3.2B", label: "Contract Value" },
    { value: "2,847", label: "Active Users" },
    { value: "95%", label: "Time Saved" },
  ];

  return (
    <section className="relative pt-36">
      <div className=" px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col  lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-3/4">
            <div className="flex flex-wrap gap-2 mb-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 bg-surface-warm border border-border-warm text-text-warm px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  <span className="font-semibold">{stat.value}</span>{" "}
                  {stat.label}
                </div>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text leading-tight">
              The #1 Procurement Portal
              <br />
              <span className="text-accent">for Canadian Businesses</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-3xl leading-relaxed">
              Stop searching dozens of procurement sites. Our AI finds
              opportunities across all Canadian jurisdictions that perfectly
              match your business capabilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate("/sign-up")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white font-semibold text-base sm:text-lg rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-border-warm text-text font-semibold text-base sm:text-lg rounded-lg hover:bg-surface-warm hover:border-accent transition-colors"
              >
                View Pricing
              </button>
            </div>

            {/* Social proof */}
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-text-muted mb-12">
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
                <span>Used by 50+ Canadian businesses</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block absolute right-0 top-[-55px] w-full lg:w-1/2">
            <img src="/landingPage.png" alt="Hero" />
          </div>
        </div>
      </div>

      {/* Trusted by Customers Marquee */}
      <div className=" w-full py-12 bg-accent">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Every Canadian Tender, One Powerful Platform.
            </h2>
          </div>
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-12 animate-marquee whitespace-nowrap w-max">
              {Array(2)
                .fill([
                  "brampton.jpg",
                  "canada.svg",
                  "hamilton.png",
                  "london.jpg",
                  "mississauga.png",
                  "ontario.png",
                  "quebec.svg",
                  "toronto.jpg",
                ])
                .flat()
                .map((img, i) => (
                  <div
                    key={`scroll-logo-${i}`}
                    className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center"
                  >
                    <img
                      src={`/sources/${img}`}
                      alt={`Partner ${img}`}
                      className="h-16 object-contain"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
