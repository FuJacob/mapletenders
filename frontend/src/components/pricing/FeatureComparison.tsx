import { CheckCircle } from "@phosphor-icons/react";
import type { PlanFeature } from "./types";

const features: PlanFeature[] = [
  {
    feature: "AI-powered search",
    starter: true,
    pro: true,
  },
  {
    feature: "Email notifications",
    starter: true,
    pro: true,
  },
  {
    feature: "Mobile app access",
    starter: true,
    pro: true,
  },
  {
    feature: "CSV exports",
    starter: true,
    pro: true,
  },
  {
    feature: "Advanced AI search",
    starter: false,
    pro: true,
  },
  {
    feature: "Win probability analysis",
    starter: false,
    pro: true,
  },
  {
    feature: "Smart alerts",
    starter: false,
    pro: true,
  },
  {
    feature: "API access",
    starter: false,
    pro: true,
  },
  {
    feature: "Priority support",
    starter: false,
    pro: true,
  },
];

export default function FeatureComparison() {
  return (
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
                <th className="text-center py-4 text-text">Pro</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {features.map((row, index) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}