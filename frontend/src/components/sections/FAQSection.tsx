const faqs = [
  {
    question: "How accurate is the AI matching?",
    answer: "Our AI achieves 95%+ accuracy by analyzing your business capabilities against contract requirements. It understands industry context and technical specifications."
  },
  {
    question: "Do you cover all Canadian jurisdictions?",
    answer: "Yes, we monitor federal, provincial, territorial, and municipal opportunities across all of Canada, from major cities to rural communities."
  },
  {
    question: "How quickly are new contracts added?",
    answer: "We scan for new opportunities every hour. Most contracts appear in your results within 2-4 hours of government posting."
  },
  {
    question: "Can I try before purchasing?",
    answer: "Yes, start with a 14-day free trial - no credit card required. Experience the full platform and measure the impact on your procurement process."
  }
];

export default function FAQSection() {
  return (
    <section className="py-20 px-6 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-text mb-4">
            Common questions
          </h2>
          <p className="text-text-muted">
            Everything you need to know about MapleTenders
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text mb-3">
                {faq.question}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
