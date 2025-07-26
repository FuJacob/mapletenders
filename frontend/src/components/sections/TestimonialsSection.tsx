import { Star } from "@phosphor-icons/react";

const testimonials = [
  {
    quote:
      "MapleTenders helped us find $1.2M worth of relevant contracts in our first month. The AI understands our business better than we expected.",
    author: "Sarah Chen",
    title: "Business Development, TechFlow Solutions",
    avatar: "SC",
  },
  {
    quote:
      "Finally stopped wasting time on irrelevant tenders. The platform's accuracy is impressive for government procurement.",
    author: "Marcus Rodriguez",
    title: "CEO, Infrastructure Plus",
    avatar: "MR",
  },
  {
    quote:
      "The deadline alerts alone have saved us from missing opportunities. ROI was clear within 30 days.",
    author: "Jennifer Walsh",
    title: "VP Sales, DataSecure Inc.",
    avatar: "JW",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-primary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Trusted by Canadian contractors
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto">
            See how businesses are winning more contracts with AI-powered
            procurement intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-white/20 rounded-lg p-6 lg:p-8"
            >
              <div className="flex items-center gap-1 mb-4 lg:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 sm:w-5 h-4 sm:h-5 text-primary"
                    weight="fill"
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-text-muted mb-4 lg:mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary rounded-lg flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-text text-sm sm:text-base">
                    {testimonial.author}
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
