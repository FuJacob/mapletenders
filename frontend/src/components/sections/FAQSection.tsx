import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { CaretDown } from "@phosphor-icons/react";
const faqs = [
  {
    question: "How is MapleTenders different from free government sites?",
    answer:
      "While government sites list tenders, MapleTenders aggregates everything nationwide and enhances it with AI-powered search, fit scoring, and smart summaries—cutting research time drastically.",
  },
  {
    question: "What types of businesses benefit most from MapleTenders?",
    answer:
      "We’re built for Canadian SMEs across industries—construction, IT, consulting, logistics—who regularly or occasionally bid on government work and want a smarter, faster way to find and assess opportunities.",
  },
  {
    question: "How does the AI determine fit or relevance?",
    answer:
      "Our AI analyzes tender documents using natural language understanding and compares them to your saved business profile—skills, certifications, past projects—to score relevance and risk level.",
  },
  {
    question: "Is this compliant with federal procurement regulations?",
    answer:
      "Yes. MapleTenders only indexes publicly available data and respects all Canadian privacy and procurement data handling requirements.",
  },
  {
    question: "How frequently is the data updated?",
    answer:
      "Every 30 minutes. We scan federal, provincial, and municipal portals and update listings so you never miss a window.",
  },
  {
    question: "Do I need technical expertise to use it?",
    answer:
      "No. MapleTenders is designed for non-technical users. You get intuitive search, filters, and dashboards without needing to understand procurement jargon.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a 14-day free trial with full access—no credit card required. It’s the easiest way to see the impact on your workflow.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-primary">
      <div className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-4 justify-center text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-accent mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-text-muted">
              Everything you need to know about MapleTenders
            </p>
          </div>
          <div className="lg:col-span-2 lg:col-start-2 flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <div
                    className={`border border-border rounded-lg overflow-hidden transition-all ${
                      open ? "bg-surface-muted" : "bg-surface"
                    }`}
                  >
                    <DisclosureButton className="w-full text-left px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-medium text-text focus:outline-none focus-visible:ring focus-visible:ring-primary">
                      <div className="flex items-center justify-between">
                        <span>{faq.question}</span>
                        <CaretDown className="w-4 h-4" />
                      </div>
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pb-4 sm:px-6 sm:pb-6 text-sm sm:text-base text-text-muted leading-relaxed">
                      {faq.answer}
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
