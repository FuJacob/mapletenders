import { CheckCircle, Leaf } from "@phosphor-icons/react";
import type { PlanFeature } from "./types";

const features: PlanFeature[] = [
  {
    feature: "AI-powered contract matching",
    starter: true,
    pro: true,
  },
  {
    feature: "All Canadian jurisdictions",
    starter: true,
    pro: true,
  },
  {
    feature: "Deadline tracking",
    starter: true,
    pro: true,
  },
  {
    feature: "Basic email alerts",
    starter: true,
    pro: true,
  },
  {
    feature: "CSV exports",
    starter: true,
    pro: true,
  },
  {
    feature: "Smart opportunity scoring",
    starter: false,
    pro: true,
  },
  {
    feature: "Advanced filtering & search",
    starter: false,
    pro: true,
  },
  {
    feature: "Competition analysis",
    starter: false,
    pro: true,
  },
  {
    feature: "Custom alert rules",
    starter: false,
    pro: true,
  },
  {
    feature: "Multiple team members",
    starter: false,
    pro: true,
  },
  {
    feature: "API access",
    starter: false,
    pro: true,
  },
  {
    feature: "Priority Canadian support",
    starter: false,
    pro: true,
  },
];

export default function FeatureComparison() {
  return (
    <section className="py-12 px-6 bg-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-4">
            <Leaf className="w-3 h-3" />
            Everything you need to succeed
          </div>
          <h2 className="text-3xl font-bold mb-4 text-text">
            Compare plan features
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Both plans include access to all Canadian procurement opportunities. Choose Pro for advanced features and team collaboration.
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-border-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-warm">
                <tr>
                  <th className="text-left py-6 px-6 text-text font-semibold">Features</th>
                  <th className="text-center py-6 px-4 text-text font-semibold">Starter</th>
                  <th className="text-center py-6 px-4 text-text font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr key={index} className={`border-t border-border-warm ${index % 2 === 0 ? 'bg-surface' : 'bg-surface-warm/30'}`}>
                    <td className="py-4 px-6 text-text font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">
                      {row.starter ? (
                        <CheckCircle className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {row.pro ? (
                        <CheckCircle className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-text-muted">
            All plans include a 14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}