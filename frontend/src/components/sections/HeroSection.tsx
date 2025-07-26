import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, Star } from "@phosphor-icons/react";

export default function HeroSection() {
  const navigate = useNavigate();
  const stats = [
    { value: "47,000+", label: "Active Tenders" },
    { value: "$3.2B", label: "Contract Value" },
    { value: "2,847", label: "Active Users" },
    { value: "95%", label: "Time Saved" },
  ];
  const reviews = [
    {
      name: "Amanpreet S., Waterloo",
      review:
        "The AI recommendations are uncannily accurate. We've won bids I would miss before.",
    },
    {
      name: "Jared M., Hamilton",
      review:
        "Fast, clean, and actually helps you filter out the noise. MapleTenders feels like cheating.",
    },
    {
      name: "Rajiv P., Toronto",
      review:
        "Love the alerts and the smart tags. I find relevant contracts faster than with any other platform.",
    },
    {
      name: "Mike D., Ottawa",
      review:
        "Switching from spreadsheets to MapleTenders was a no-brainer. Our team collaboration skyrocketed.",
    },
    {
      name: "Steve K., Mississauga",
      review: "MapleTenders doesn't just show bids, it helps us win them.",
    },
  ];
  const images = [
    "brampton.jpg",
    "canada.svg",
    "hamilton.png",
    "london.jpg",
    "mississauga.png",
    "ontario.png",
    "quebec.svg",
    "toronto.jpg",
  ];
  const shuffled = [...reviews, ...images].sort(() => Math.random() - 0.5);

  return (
    <section className="relative pt-36">
      <div className=" px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col  lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-3/4">
            <div className="flex flex-wrap gap-2 mb-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 bg-surface-warm border border-border-warm text-text-warm px-3 py-1.5 rounded-lg text-xs font-medium"
                >
                  <span className="font-semibold">{stat.value}</span>{" "}
                  {stat.label}
                </div>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-text leading-tight">
              The #1 Procurement Portal
              <br />
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
            <div className="flex gap-12 animate-marquee w-max">
              {Array(2)
                .fill([...shuffled, ...shuffled])
                .flat()
                .map((item, i) => {
                  if (typeof item === "string") {
                    return (
                      <div
                        key={`scroll-logo-${i}`}
                        className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-center"
                      >
                        <img
                          src={`/sources/${item}`}
                          alt={`Partner ${item}`}
                          className="h-16 object-contain"
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`scroll-review-${i}`}
                        className="bg-white rounded-lg p-4 shadow-sm flex flex-col justify-center max-w-xs"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 sm:w-5 h-4 sm:h-5 text-primary"
                                weight="fill"
                              />
                            ))}
                          </div>
                          <div className="text-xs text-text-muted font-semibold">
                            {item.name}
                          </div>
                        </div>
                        <div className="text-sm text-text-muted font-medium italic mb-2 text-wrap">
                          "
                          {item.review.length > 65
                            ? item.review.slice(0, 65) + ". . ."
                            : item.review}
                          "
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
