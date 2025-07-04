import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lightning,
  CheckCircle,
  Crown,
  Target,
  ArrowLeft,
  Star,
  Phone,
} from "@phosphor-icons/react";
import { Header } from "../components/layout";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  popular?: boolean;
  description: string;
  features: string[];
  limits: {
    searches: string;
    alerts: string;
    exports: string;
    users: string;
  };
  cta: string;
  stripeProductId?: string; // For future Stripe integration
}

export default function Pricing() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const pricingTiers: PricingTier[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingCycle === "monthly" ? 49 : 490,
      billingCycle,
      description: "Perfect for freelancers and small businesses getting started",
      features: [
        "AI-powered tender search",
        "Basic search filters",
        "Email notifications",
        "Export to CSV",
        "Standard support",
        "Mobile app access",
      ],
      limits: {
        searches: "100/month",
        alerts: "3 active alerts",
        exports: "25/month",
        users: "1 user",
      },
      cta: "Start Free Trial",
      stripeProductId: "price_starter_monthly", // Placeholder for Stripe
    },
    {
      id: "professional",
      name: "Professional",
      price: billingCycle === "monthly" ? 149 : 1490,
      billingCycle,
      popular: true,
      description: "Ideal for growing companies winning more contracts",
      features: [
        "Everything in Starter",
        "Advanced AI search",
        "Win probability analysis",
        "Smart alerts & notifications",
        "Advanced export options",
        "Team collaboration",
        "Priority support",
        "API access",
        "Custom reports",
      ],
      limits: {
        searches: "Unlimited",
        alerts: "15 active alerts",
        exports: "Unlimited",
        users: "5 users",
      },
      cta: "Start Free Trial",
      stripeProductId: "price_professional_monthly",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingCycle === "monthly" ? 499 : 4990,
      billingCycle,
      description: "For large organizations needing advanced features",
      features: [
        "Everything in Professional",
        "Custom AI training",
        "Dedicated account manager",
        "White-label options",
        "SSO & advanced security",
        "Custom integrations",
        "24/7 phone support",
        "Onboarding & training",
        "SLA guarantees",
      ],
      limits: {
        searches: "Unlimited",
        alerts: "Unlimited",
        exports: "Unlimited",
        users: "Unlimited",
      },
      cta: "Contact Sales",
      stripeProductId: "price_enterprise_monthly",
    },
  ];

  const handlePlanSelect = (tier: PricingTier) => {
    if (tier.id === "enterprise") {
      // Navigate to contact form for enterprise
      navigate("/contact");
    } else {
      // For Starter and Professional, navigate to sign-up with plan info
      navigate(`/sign-up?plan=${tier.id}&billing=${billingCycle}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h1 className="text-5xl font-bold mb-4 text-text">
            Choose your plan
          </h1>
          <p className="text-xl text-text-light mb-8 max-w-2xl mx-auto">
            Start winning government contracts with AI-powered tender discovery. 
            All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-text" : "text-text-light"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                billingCycle === "yearly" ? "bg-primary" : "bg-border"
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                  billingCycle === "yearly" ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${billingCycle === "yearly" ? "text-text" : "text-text-light"}`}>
                Yearly
              </span>
              {billingCycle === "yearly" && (
                <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                  Save 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  tier.popular
                    ? "border-primary bg-primary/5 scale-105"
                    : "border-border bg-surface"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-white text-sm font-medium rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    {tier.id === "starter" && <Lightning className="w-8 h-8 text-accent" />}
                    {tier.id === "professional" && <Target className="w-8 h-8 text-primary" />}
                    {tier.id === "enterprise" && <Crown className="w-8 h-8 text-secondary" />}
                  </div>
                  <h3 className="text-2xl font-bold text-text mb-2">{tier.name}</h3>
                  <p className="text-text-light text-sm mb-4">{tier.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-text">
                      ${tier.price}
                    </span>
                    <span className="text-text-light">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-xs text-text-light mt-1">
                      ${Math.round(tier.price / 12)}/month billed annually
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className="mb-6 p-4 bg-background rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-text-light">Searches:</span>
                      <div className="font-medium text-text">{tier.limits.searches}</div>
                    </div>
                    <div>
                      <span className="text-text-light">Alerts:</span>
                      <div className="font-medium text-text">{tier.limits.alerts}</div>
                    </div>
                    <div>
                      <span className="text-text-light">Exports:</span>
                      <div className="font-medium text-text">{tier.limits.exports}</div>
                    </div>
                    <div>
                      <span className="text-text-light">Users:</span>
                      <div className="font-medium text-text">{tier.limits.users}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(tier)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    tier.popular
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-border text-text hover:bg-surface hover:border-primary"
                  }`}
                >
                  {tier.cta}
                </button>

                {tier.id !== "enterprise" && (
                  <p className="text-xs text-center text-text-light mt-3">
                    14-day free trial • No credit card required
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 px-6 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text">
            Compare all features
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 text-text">Features</th>
                  <th className="text-center py-4 text-text">Starter</th>
                  <th className="text-center py-4 text-text">Professional</th>
                  <th className="text-center py-4 text-text">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "AI-powered search", starter: true, pro: true, enterprise: true },
                  { feature: "Email notifications", starter: true, pro: true, enterprise: true },
                  { feature: "Mobile app", starter: true, pro: true, enterprise: true },
                  { feature: "Win probability analysis", starter: false, pro: true, enterprise: true },
                  { feature: "Advanced filters", starter: false, pro: true, enterprise: true },
                  { feature: "Team collaboration", starter: false, pro: true, enterprise: true },
                  { feature: "API access", starter: false, pro: true, enterprise: true },
                  { feature: "Custom reports", starter: false, pro: true, enterprise: true },
                  { feature: "Priority support", starter: false, pro: true, enterprise: true },
                  { feature: "Phone support", starter: false, pro: false, enterprise: true },
                  { feature: "SSO integration", starter: false, pro: false, enterprise: true },
                  { feature: "Custom AI training", starter: false, pro: false, enterprise: true },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 text-text">{row.feature}</td>
                    <td className="text-center py-3">
                      {row.starter ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-text-light">—</span>
                      )}
                    </td>
                    <td className="text-center py-3">
                      {row.pro ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-text-light">—</span>
                      )}
                    </td>
                    <td className="text-center py-3">
                      {row.enterprise ? (
                        <CheckCircle className="w-4 h-4 text-success mx-auto" />
                      ) : (
                        <span className="text-text-light">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-text">
            Frequently asked questions
          </h2>

          <div className="space-y-6">
            {[
              {
                question: "Can I change plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle."
              },
              {
                question: "What happens after my free trial?",
                answer: "Your free trial lasts 14 days. After that, you'll be charged for your selected plan unless you cancel."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee on all annual plans. Monthly plans can be cancelled anytime."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and ACH transfers for annual plans."
              },
              {
                question: "Is there a setup fee?",
                answer: "No setup fees, no hidden costs. The price you see is what you pay."
              },
              {
                question: "Can I get a custom plan?",
                answer: "Yes! Contact our sales team for custom pricing based on your specific needs."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h3 className="font-semibold text-text mb-2">{faq.question}</h3>
                <p className="text-text-light">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center border-t border-border bg-surface">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-text">
            Ready to start winning?
          </h2>
          <p className="text-lg text-text-light mb-8">
            Join thousands of businesses already using Procuroo to discover and win government contracts.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/sign-up")}
              className="px-8 py-4 bg-primary text-white text-lg font-medium rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Lightning className="w-5 h-5" />
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-4 border border-border text-text text-lg rounded-lg flex items-center gap-2 hover:bg-background transition-colors"
            >
              <Phone className="w-5 h-5" />
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t text-center text-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>© 2025 Procuroo</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:underline text-text-light">
              Privacy
            </Link>
            <Link to="/terms" className="hover:underline text-text-light">
              Terms
            </Link>
            <Link to="/contact" className="hover:underline text-text-light">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
