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
    <section className="relative pt-36 text-center">
      <div className="px-6 max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full">
            <div className="flex flex-wrap gap-2 mb-6 justify-center items-center ">
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
              <span className="text-primary">for Canadian Businesses</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-muted mb-8 max-w-3xl leading-relaxed">
              Stop searching dozens of procurement sites, and let MapleTenders
              do the work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center items-center">
              <button
                onClick={() => navigate("/sign-up")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-accent text-white font-semibold text-base sm:text-lg rounded-lg hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("#pricing")}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-border-warm text-text font-semibold text-base sm:text-lg rounded-lg hover:bg-surface-warm hover:border-accent transition-colors"
              >
                Watch Demo
              </button>
            </div>

            {/* Social proof */}
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm text-text-muted mb-12 justify-center items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by Customers Marquee */}
      <div className=" w-full py-12 mb-12">
        <div className="mx-auto">
          <div className="relative w-full overflow-hidden">
            <div className="flex gap-12 animate-marquee w-max py-2">
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
