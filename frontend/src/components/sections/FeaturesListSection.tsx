import {
  MagnifyingGlass,
  Table,
  FileText,
  Calendar,
} from "@phosphor-icons/react";

// Array of feature objects, concise and outcome-focused
const features = [
  {
    title: "Find your next win. Instantly.",
    subtitle: "AI‑Powered Search",
    icon: MagnifyingGlass,
    bgColor: "bg-primary/20",
    color: "text-primary",
    image: "1.png",
  },
  {
    title: "See everything at a glance.",
    subtitle: "Comprehensive Table View",
    icon: Table,
    bgColor: "bg-maple/20",
    color: "text-maple",
    image: "2.png",
  },
  {
    title: "Understand what matters.",
    subtitle: "RFP Analysis & Insights",
    icon: FileText,
    bgColor: "bg-accent/20",
    color: "text-accent",
    image: "3.png",
  },
  {
    title: "Never miss a deadline.",
    subtitle: "Smart Calendar Management",
    icon: Calendar,
    bgColor: "bg-info/20",
    color: "text-info",
    image: "4.png",
  },
];

export default function FeaturesListSection() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-5xl mx-auto space-y-20">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="relative rounded-xl overflow-hidden">
              <img
                src={`/features/${feature.image}`}
                alt={feature.title}
                className="w-full h-[360px] object-cover"
              />
              <div className="absolute top-0 left-0 w-full pt-6 px-8 pb-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                <div className="flex flex-col sm:flex-row items-center gap-3 text-white">
                  <Icon className="w-7 h-7" />
                  <div>
                    <h3 className="text-lg tracking-tight font-medium">{feature.subtitle}</h3>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{feature.title}</h2>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
