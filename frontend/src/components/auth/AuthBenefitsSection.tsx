import {
  CheckCircle,
  Target,
  TrendUp,
  Lightning,
  Star,
  ArrowRight,
  ChartLineUp,
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
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-surface via-surface to-surface-muted items-center justify-center px-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-l from-success/10 to-maple/10 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-tr from-accent/5 to-primary/5 rounded-full blur-xl" />
      </div>

      <div className="max-w-lg relative z-10">
        {/* Enhanced header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-warning fill-current" />
              ))}
            </div>
            <span className="text-sm text-text-muted font-medium">4.9/5 from 2,847+ users</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 leading-tight">{title}</h2>
          <p className="text-lg text-text-muted leading-relaxed">{subtitle}</p>
        </div>

        {/* Enhanced Success Stories */}
        <div className="space-y-6 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="group flex items-start gap-4 p-4 rounded-xl hover:bg-background/50 transition-all duration-300 hover:shadow-sm">
              <div className={`flex-shrink-0 w-14 h-14 ${benefit.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                {benefit.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                  {benefit.title}
                </div>
                <div className="text-sm text-text-muted leading-relaxed">
                  {benefit.description}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Enhanced Trust Indicators */}
        <div className="bg-background/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChartLineUp className="w-5 h-5 text-success" />
            <span className="font-semibold text-text">Platform Stats</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface/50 transition-colors">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-text-muted font-medium">{indicator.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl">
          <div className="text-text-muted text-sm italic mb-2">
            "Mapletenders helped us win our first $500K government contract within 30 days of signing up."
          </div>
          <div className="text-xs text-text-muted font-medium">
            — Sarah Chen, CEO at BuildTech Solutions
          </div>
        </div>
      </div>
    </div>
  );
}