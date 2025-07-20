import {
  CheckCircle,
  Target,
  TrendUp,
  Lightning,
} from "@phosphor-icons/react";

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

interface TrustIndicator {
  text: string;
}

interface AuthBenefitsSectionProps {
  title?: string;
  subtitle?: string;
  benefits?: Benefit[];
  trustIndicators?: TrustIndicator[];
}

const defaultBenefits: Benefit[] = [
  {
    icon: <Target className="w-6 h-6 text-success" />,
    title: "$1.2M in contracts found",
    description: "MapleTenders helped us discover opportunities we never would have found manually.",
    iconBg: "bg-success/10",
  },
  {
    icon: <TrendUp className="w-6 h-6 text-primary" />,
    title: "95% time saved on search",
    description: "The AI matches help us focus on contracts we can actually win.",
    iconBg: "bg-primary/10",
  },
  {
    icon: <Lightning className="w-6 h-6 text-primary" />,
    title: "Never miss deadlines",
    description: "Smart alerts ensure we're always first to know about new opportunities.",
    iconBg: "bg-secondary/50",
  },
];

const defaultTrustIndicators: TrustIndicator[] = [
  { text: "Enterprise Security" },
  { text: "99.9% Uptime" },
  { text: "2,847+ Users" },
  { text: "$3.2B Tracked" },
];

export default function AuthBenefitsSection({
  title = "Your next contract is waiting",
  subtitle = "Join Canadian contractors already winning government tenders with AI-powered discovery.",
  benefits = defaultBenefits,
  trustIndicators = defaultTrustIndicators,
}: AuthBenefitsSectionProps) {
  return (
    <div className="hidden lg:flex flex-1 bg-surface items-center justify-center px-12">
      <div className="max-w-lg">
        <h2 className="text-3xl font-semibold text-text mb-6">{title}</h2>
        <p className="text-lg text-text-muted mb-8">{subtitle}</p>

        {/* Success Stories */}
        <div className="space-y-6 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 ${benefit.iconBg} rounded-lg flex items-center justify-center`}>
                {benefit.icon}
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  {benefit.title}
                </div>
                <div className="text-sm text-text-muted">
                  {benefit.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm text-text-muted">
            {trustIndicators.map((indicator, index) => (
              <span key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                {indicator.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}