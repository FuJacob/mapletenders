const faqs = [
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.",
  },
  {
    question: "What happens after my free trial?",
    answer:
      "Your free trial lasts 14 days. After that, you'll be charged for your selected plan unless you cancel.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 30-day money-back guarantee on all annual plans. Monthly plans can be cancelled anytime.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and ACH transfers for annual plans.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees, no hidden costs. The price you see is what you pay.",
  },
  {
    question: "Can I get a custom plan?",
    answer:
      "Yes! Contact our sales team for custom pricing based on your specific needs.",
  },
];

export default function FAQ() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-text">
          Frequently asked questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border pb-6">
              <h3 className="font-semibold text-text mb-2">{faq.question}</h3>
              <p className="text-text-light">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}