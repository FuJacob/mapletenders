export interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
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
  stripeProductId?: string;
}

export interface PlanFeature {
  feature: string;
  starter: boolean;
  pro: boolean;
}