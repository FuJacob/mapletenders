import {
  Globe,
  CheckCircle,
  Lightning,
  Eye,
  Target,
} from "@phosphor-icons/react";

export default function TableComparisonSection() {
  return (
    <section className="min-h-screen flex items-center py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-32">
          <div className="flex items-center justify-center gap-4 mb-16">
            <Globe className="w-12 h-12 text-primary" weight="duotone" />
            <h2 className="text-7xl font-light text-text leading-tight">
              Compare the table views
              <br />
              <span className="text-primary font-bold">side by side</span>
            </h2>
          </div>
          <p className="text-3xl text-text-light max-w-4xl mx-auto">
            See how MapleTenders transforms cluttered government data into
            actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Government Portal Figure */}
          <div className="bg-background border border-border rounded-3xl p-12 text-center">
            <h3 className="text-4xl font-semibold mb-6 text-text">
              Government Portal Interface
            </h3>
            <div className="text-lg text-red-600 font-semibold mb-12">
              ❌ Overwhelming & Unclear
            </div>

            <div className="w-full h-96 bg-red-100 border-2 border-red-200 rounded-2xl flex items-center justify-center mb-12">
              <div className="text-center text-red-700">
                <div className="text-2xl font-medium mb-2">
                  Government Portal Screenshot
                </div>
                <div className="text-lg">Dense, cluttered, hard to scan</div>
              </div>
            </div>
          </div>

          {/* MapleTenders Figure */}
          <div className="bg-background border border-border rounded-3xl p-12 text-center">
            <h3 className="text-4xl font-semibold mb-6 text-text">
              MapleTenders Interface
            </h3>
            <div className="text-lg text-success font-semibold mb-12">
              ✅ Clean & Actionable
            </div>

            <div className="w-full h-96 bg-green-100 border-2 border-green-200 rounded-2xl flex items-center justify-center mb-12">
              <div className="text-center text-green-700">
                <div className="text-2xl font-medium mb-2">
                  MapleTenders Screenshot
                </div>
                <div className="text-lg">Clean, focused, easy to scan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons Comparison */}
        <div className="mt-20 grid md:grid-cols-2 gap-16">
          {/* Government Portal Cons */}
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-12">
            <h4 className="text-3xl font-semibold mb-8 text-text text-center">
              Government Portal Problems
            </h4>
            <ul className="space-y-6 text-xl">
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  Cryptic abbreviations and reference codes
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  Truncated titles with missing context
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  No relevance scoring or prioritization
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  Information overload - too many columns
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  Tiny text that's hard to scan quickly
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-2xl flex-shrink-0">✗</span>
                <span className="text-text">
                  Poor visual hierarchy and design
                </span>
              </li>
            </ul>
          </div>

          {/* MapleTenders Pros */}
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-12">
            <h4 className="text-3xl font-semibold mb-8 text-text text-center">
              MapleTenders Advantages
            </h4>
            <ul className="space-y-6 text-xl">
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  Clear, readable titles and descriptions
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  AI relevance scoring for each opportunity
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  Visual icons and intuitive layout
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  Smart column design - only what you need
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  Scannable at a glance with proper spacing
                </span>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="w-7 h-7 text-success flex-shrink-0 mt-1" />
                <span className="text-text">
                  Modern, professional interface design
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Stats Comparison */}
        <div className="mt-20 bg-surface border border-border rounded-3xl p-12">
          <h4 className="text-3xl font-semibold text-center mb-12 text-text">
            The User Experience Difference
          </h4>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Lightning className="w-10 h-10 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold mb-4 text-success">5x</div>
              <div className="text-xl text-text-light">
                Faster to scan results
              </div>
            </div>
            <div>
              <Eye className="w-10 h-10 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold mb-4 text-success">90%</div>
              <div className="text-xl text-text-light">Less eye strain</div>
            </div>
            <div>
              <Target className="w-10 h-10 text-success mx-auto mb-4" />
              <div className="text-5xl font-bold mb-4 text-success">100%</div>
              <div className="text-xl text-text-light">
                Relevance transparency
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
