const faqs = [
  {
    question: "How accurate is the AI matching?",
    answer:
      "Our AI achieves 95%+ accuracy by analyzing your business capabilities against contract requirements. It understands industry context and technical specifications.",
  },
  {
    question: "Do you cover all Canadian jurisdictions?",
    answer:
      "Yes, we monitor federal, provincial, territorial, and municipal opportunities across all of Canada, from major cities to rural communities.",
  },
  {
    question: "How quickly are new contracts added?",
    answer:
      "We scan for new opportunities every hour. Most contracts appear in your results within 2-4 hours of government posting.",
  },
  {
    question: "Can I try before purchasing?",
    answer:
      "Yes, start with a 14-day free trial - no credit card required. Experience the full platform and measure the impact on your procurement process.",
    grow: 2,
  },
  {
    question: "Can I try before purchasing?",
    answer:
      "Yes, start with a 14-day free trial - no credit card required. Experience the full platform and measure the impact on your procurement process.",
    grow: 3,
  },
  {
    question: "Can I try before purchasing?",
    answer:
      "Yes, start with a 14-day free trial - no credit card required. Experience the full platform and measure the impact on your procurement process.",
    grow: 2,
  },
  {
    question: "Can I try before purchasing?",
    answer:
      "Yes, start with a 14-day free trial - no credit card required. Experience the full platform and measure the impact on your procurement process.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-primary">
      <div className="py-20 px-6 bg-surface">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 justify-center text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-accent mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Everything you need to know about MapleTenders
            </p>
          </div>

          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-border rounded-lg p-4 sm:p-6 ${
                faq.grow && faq.grow === 2
                  ? "lg:col-span-2"
                  : faq.grow === 3
                  ? "lg:col-span-3"
                  : "lg:col-span-1"
              }`}
            >
              <h3 className="text-base sm:text-lg font-semibold text-text mb-2 sm:mb-3">
                {faq.question}
              </h3>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
