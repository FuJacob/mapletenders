export default function FAQSection() {
  return (
    <section className="min-h-screen flex items-center py-32 px-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Split Header Layout */}
        <div className="grid md:grid-cols-5 gap-16 mb-24">
          <div className="md:col-span-2">
            <h2 className="text-7xl font-black text-text leading-[0.8] mb-8">
              Frequently
              <br />
              <span className="text-primary font-light italic">asked</span>
              <br />
              questions
            </h2>
          </div>
          <div className="md:col-span-3 flex items-end">
            <p className="text-2xl text-text-light leading-relaxed">
              Everything you need to know about MapleTenders for your business
              operations
            </p>
          </div>
        </div>

        {/* Staggered FAQ Items */}
        <div className="space-y-12">
          <div className="border border-border rounded-3xl p-12 ml-0">
            <h3 className="text-3xl font-semibold mb-8 text-text">
              How accurate is the AI search?
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              Our enterprise AI has been trained on thousands of government
              procurement documents and achieves 95%+ accuracy in matching
              businesses with relevant opportunities. It understands industry
              context, technical requirements, and regulatory nuance.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-12 ml-16">
            <h3 className="text-3xl font-semibold mb-8 text-text">
              Do you cover all provinces and territories?
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              Yes, we monitor federal, provincial, territorial, and municipal
              procurement opportunities across all of Canada. From major cities
              to rural communities.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-12 ml-8">
            <h3 className="text-3xl font-semibold mb-8 text-text">
              How quickly are new tenders added?
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              We scan for new opportunities every hour and most tenders appear
              in your search results within 2-4 hours of being posted by the
              government agency.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-12 ml-24">
            <h3 className="text-3xl font-semibold mb-8 text-text">
              Can I try it before I buy?
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              Absolutely. Begin with a 14-day enterprise trial - no credit card
              required. Experience our full platform capabilities and measure
              the operational impact on your procurement processes.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-12 ml-4">
            <h3 className="text-3xl font-semibold mb-8 text-text">
              What if our team needs implementation support?
            </h3>
            <p className="text-xl text-text-light leading-relaxed">
              Every enterprise client receives dedicated onboarding and change
              management support from our customer success team. We'll configure
              your platform, train your teams, and ensure seamless integration
              with your existing workflows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
