import { useEffect, useRef, useState } from "react";
import {
  MagnifyingGlass,
  Table,
  FileText,
  Calendar,
} from "@phosphor-icons/react";

// Array of feature objects used to render each section dynamically
const features = [
  {
    image: "1.png",
    title: "AI-Powered Search",
    subtitle: "Find opportunities that match your business",
    paragraph:
      "Our intelligent search engine uses AI to match you with the most relevant government contracts across all Canadian jurisdictions. Get personalized results based on your company profile, industry, and past bidding history.",
    icon: MagnifyingGlass,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    image: "2.png",
    title: "Comprehensive Table View",
    subtitle: "All opportunities in one organized view",
    paragraph:
      "Browse thousands of procurement opportunities in a powerful table format. Filter by region, category, deadline, and value. Sort, search, and export data to make informed bidding decisions quickly and efficiently.",
    icon: Table,
    color: "text-maple",
    bgColor: "bg-maple/10",
  },
  {
    image: "3.png",
    title: "RFP Analysis & Insights",
    subtitle: "AI-powered document analysis",
    paragraph:
      "Upload RFP documents and get instant AI-powered analysis. Extract key requirements, deadlines, evaluation criteria, and budget information. Get strategic recommendations to improve your proposal success rate.",
    icon: FileText,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    image: "4.png",
    title: "Smart Calendar Management",
    subtitle: "Never miss an important deadline",
    paragraph:
      "Track all your bookmarked opportunities with intelligent deadline management. Get visual timeline views, urgent deadline alerts, and automated reminders. Stay organized and never miss a submission deadline again.",
    icon: Calendar,
    color: "text-info",
    bgColor: "bg-info/10",
  },
];

export default function Features() {
  // Tracks which image should be displayed on the left as user scrolls
  const [currentFeature, setCurrentFeature] = useState(0);
  // Stores references to each feature section on the right
  const refs = useRef<(HTMLElement | null)[]>([]);

  // Initialize the refs array to hold DOM references for each feature section
  useEffect(() => {
    refs.current = features.map((_, i) => refs.current[i] || null);
  }, []);

  // Sets up an IntersectionObserver to update the left image when a section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let activeIndex = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            const index = refs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1) {
              maxRatio = entry.intersectionRatio;
              activeIndex = index;
            }
          }
        });

        if (maxRatio > 0) {
          setCurrentFeature(activeIndex);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    // Start observing each feature section
    refs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // Stop observing when component unmounts
      refs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Render split-screen layout with sticky image on the left and scrollable sections on the right
  return (
    <section className="min-h-screen bg-background px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20">
      <div className="">
        <div className="grid lg:grid-cols-2 min-h-screen mx-auto">
          {/* Left sticky image that updates based on scroll */}
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
              {/* Current feature screenshot */}
              <div className="relative w-full">
                <div className="relative border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
                  <img
                    src={`/features/${features[currentFeature].image}`}
                    alt={features[currentFeature].title}
                    className="w-full h-auto object-contain"
                  />

                  {/* Overlay with feature icon */}
                  <div className="absolute top-4 left-4">
                    <div
                      className={`${features[currentFeature].bgColor} rounded-lg p-2 backdrop-blur-sm`}
                    >
                      {(() => {
                        const Icon = features[currentFeature].icon;
                        return (
                          <Icon
                            className={`w-5 h-5 ${features[currentFeature].color}`}
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side scrollable content that triggers image change */}
          <div className="flex flex-col">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <section
                  key={index}
                  ref={(el: HTMLElement | null) => {
                    refs.current[index] = el;
                  }}
                  className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 py-16 sm:py-20 lg:py-24"
                >
                  <div className="bg-surface border border-border rounded-xl shadow-xl transition-all duration-500 px-5 py-6 sm:px-6 sm:py-12">
                    <div
                      className={`text-sm font-medium ${feature.color} uppercase tracking-wide mb-4`}
                    >
                      {feature.subtitle}
                    </div>
                    <div className="flex items-center gap-6 mb-6">
                      <div className={`${feature.bgColor} p-4 rounded-lg`}>
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-text">
                        {feature.title}
                      </h2>
                    </div>

                    <p className="text-lg text-text-light leading-relaxed max-w-xl">
                      {feature.paragraph}
                    </p>

                    {/* Progress indicator for current section */}
                    <div className="mt-8 flex items-center gap-2">
                      <span className="text-sm text-text">
                        {index + 1} of {features.length}
                      </span>
                      <div className="flex gap-1">
                        {features.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 w-8 rounded transition-all duration-300 ${
                              i === index ? "bg-primary" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
