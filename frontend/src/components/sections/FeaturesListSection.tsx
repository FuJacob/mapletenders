import {
  MagnifyingGlass,
  Table,
  FileText,
  Calendar,
  ArrowBendDownRight,
} from "@phosphor-icons/react";

// Array of feature objects used to render each section dynamically
const features = [
  {
    image: "1.png",
    title: "AI-Powered Search",
    subtitle: "1. Find opportunities that match your business",
    bullets: [
      "AI finds contracts that fit your business profile.",
      "Personalized matches by industry and region.",
      "Uses past bids to improve future suggestions.",
    ],
    icon: MagnifyingGlass,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    image: "2.png",
    title: "Comprehensive Table View",
    subtitle: "2. All opportunities in one organized view",
    bullets: [
      "Explore opportunities in a powerful data table.",
      "Sort and filter by value, region, or deadline.",
      "Export and manage tenders easily and quickly.",
    ],
    icon: Table,
    color: "text-maple",
    bgColor: "bg-maple/10",
  },
  {
    image: "3.png",
    title: "RFP Analysis & Insights",
    subtitle: "3. AI-powered document analysis",
    bullets: [
      "Upload RFPs to receive instant AI analysis.",
      "Extract key deadlines and budget details fast.",
      "Improve win chances with smart suggestions.",
    ],
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    image: "4.png",
    title: "Smart Calendar Management",
    subtitle: "4. Never miss an important deadline",
    bullets: [
      "Track deadlines for all your saved tenders.",
      "View timelines and get alert reminders daily.",
      "Stay ahead with auto-deadline notifications.",
    ],
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

export default function FeaturesListSection() {
  return (
    <section className="bg-background px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            So we <span className="text-primary">reimagined</span> the whole
            experience.
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Introducing MapleTenders — built for how procurement should work in
            2025, not 2005.
          </p>
        </div>

        {/* Alternating Features */}
        <div className="space-y-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`flex flex-col lg:flex-row ${
                  !isEven ? "lg:flex-row-reverse" : ""
                } items-center gap-12`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative borde rounded-xl overflow-hidden">
                    <img
                      src={`/features/${feature.image}`}
                      alt={feature.title}
                      className={`w-full h-auto object-cover rounded-xl ${
                        isEven
                          ? "bg-gradient-to-r from-white/60 via-white/30 to-transparent"
                          : "bg-gradient-to-l from-white/60 via-white/30 to-transparent"
                      }`}
                      style={{
                        maskImage: isEven
                          ? "linear-gradient(to right, transparent 0%, transparent 10%, black 60%, black 100%)"
                          : "linear-gradient(to left, transparent 0%, transparent 10%, black 60%, black 100%)",
                        WebkitMaskImage: isEven
                          ? "linear-gradient(to right, transparent 0%, transparent 10%, black 60%, black 100%)"
                          : "linear-gradient(to left, transparent 0%, transparent 10%, black 60%, black 100%)",
                      }}
                    />
                    {/* Icon Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={`${feature.bgColor} p-2 rounded-lg backdrop-blur-sm`}
                      >
                        <Icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="w-full lg:w-1/2">
                  <div
                    className={`text-sm font-medium ${feature.color} uppercase tracking-wide mb-4`}
                  >
                    {feature.subtitle}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-text mb-4">
                    {feature.title}
                  </h3>
                  <ul>
                    {feature.bullets.map((line, i) => (
                      <li
                        key={i}
                        className="text-lg text-text-muted leading-relaxed mb-2 flex items-start"
                      >
                        <ArrowBendDownRight className="w-5 h-5 text-text-muted mt-1" />
                        <span className="ml-3">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
