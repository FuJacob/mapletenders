import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  MapPin,
  Briefcase,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Lightning,
  Target,
  Users,
  TrendUp,
  Crown,
  Wrench,
  GraduationCap,
  Heart,
  Car,
  Factory,
} from "@phosphor-icons/react";
import { supabase } from "../supabase";
import { selectAuthUser } from "../features/auth/authSelectors";
import { useSelector } from "react-redux";
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isSignedIn = useSelector(selectAuthUser);

  if (!isSignedIn) {
    navigate("/signIn");
  }

  // Form data
  const [formData, setFormData] = useState({
    company_name: "",
    company_size: "",
    annual_revenue: "",
    industry: "",
    business_type: "",
    primary_services: [] as string[],
    headquarters_province: "",
    service_regions: [] as string[],
    government_experience: "",
    annual_bid_volume: "",
    typical_contract_size: "",
    primary_use_case: "",
    referral_source: "",
  });

  const companySizes = [
    {
      value: "1-10",
      label: "1-10 employees",
      description: "Solo or small team",
    },
    {
      value: "11-50",
      label: "11-50 employees",
      description: "Growing business",
    },
    {
      value: "51-200",
      label: "51-200 employees",
      description: "Medium company",
    },
    {
      value: "201-1000",
      label: "201-1000 employees",
      description: "Large enterprise",
    },
    {
      value: "1000+",
      label: "1000+ employees",
      description: "Major corporation",
    },
  ];

  const revenueRanges = [
    {
      value: "under-1m",
      label: "Under $1M",
      description: "Startup/small business",
    },
    { value: "1m-10m", label: "$1M - $10M", description: "Growing company" },
    { value: "10m-50m", label: "$10M - $50M", description: "Mid-market" },
    {
      value: "50m-250m",
      label: "$50M - $250M",
      description: "Large enterprise",
    },
    { value: "250m+", label: "$250M+", description: "Major corporation" },
  ];

  const industries = [
    {
      value: "it-services",
      label: "IT Services",
      icon: <Lightning className="w-5 h-5" />,
    },
    {
      value: "construction",
      label: "Construction",
      icon: <Building className="w-5 h-5" />,
    },
    {
      value: "consulting",
      label: "Consulting",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "professional-services",
      label: "Professional Services",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      value: "healthcare",
      label: "Healthcare",
      icon: <Heart className="w-5 h-5" />,
    },
    {
      value: "education",
      label: "Education",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      value: "manufacturing",
      label: "Manufacturing",
      icon: <Factory className="w-5 h-5" />,
    },
    {
      value: "transportation",
      label: "Transportation",
      icon: <Car className="w-5 h-5" />,
    },
    {
      value: "maintenance",
      label: "Maintenance",
      icon: <Wrench className="w-5 h-5" />,
    },
    { value: "other", label: "Other", icon: <Target className="w-5 h-5" /> },
  ];

  const businessTypes = [
    {
      value: "corporation",
      label: "Corporation",
      description: "Inc., Corp., Ltd.",
    },
    {
      value: "partnership",
      label: "Partnership",
      description: "General or Limited Partnership",
    },
    {
      value: "sole-proprietorship",
      label: "Sole Proprietorship",
      description: "Individual business owner",
    },
    {
      value: "non-profit",
      label: "Non-Profit",
      description: "NGO, charity, foundation",
    },
    {
      value: "cooperative",
      label: "Cooperative",
      description: "Member-owned organization",
    },
  ];

  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon",
  ];

  const services = [
    "Software Development",
    "IT Support & Maintenance",
    "Cybersecurity",
    "Data Analytics",
    "Cloud Services",
    "Digital Transformation",
    "Construction",
    "Infrastructure",
    "Architecture & Engineering",
    "Project Management",
    "Business Consulting",
    "HR Services",
    "Legal Services",
    "Financial Services",
    "Marketing & Communications",
    "Training & Education",
    "Research & Development",
    "Equipment Supply",
    "Facility Management",
    "Security Services",
    "Other",
  ];

  const experienceLevels = [
    {
      value: "none",
      label: "New to government contracts",
      description: "First time bidding on government work",
      icon: <Target className="w-5 h-5 text-accent" />,
    },
    {
      value: "some",
      label: "Some experience",
      description: "1-5 government contracts completed",
      icon: <TrendUp className="w-5 h-5 text-primary" />,
    },
    {
      value: "experienced",
      label: "Experienced contractor",
      description: "6+ government contracts completed",
      icon: <Crown className="w-5 h-5 text-success" />,
    },
    {
      value: "expert",
      label: "Expert contractor",
      description: "Regular government contractor, 50+ contracts",
      icon: <Lightning className="w-5 h-5 text-secondary" />,
    },
  ];

  const contractSizes = [
    { value: "under-50k", label: "Under $50K", description: "Small projects" },
    {
      value: "50k-250k",
      label: "$50K - $250K",
      description: "Medium projects",
    },
    { value: "250k-1m", label: "$250K - $1M", description: "Large projects" },
    { value: "1m-5m", label: "$1M - $5M", description: "Major contracts" },
    { value: "5m+", label: "$5M+", description: "Enterprise contracts" },
  ];

  const useCases = [
    {
      value: "discovery",
      label: "Discover new opportunities",
      description: "Find tenders I didn't know existed",
      icon: <Target className="w-5 h-5 text-primary" />,
    },
    {
      value: "monitoring",
      label: "Monitor specific contracts",
      description: "Track particular types of opportunities",
      icon: <CheckCircle className="w-5 h-5 text-success" />,
    },
    {
      value: "intelligence",
      label: "Market research",
      description: "Understand market trends and competition",
      icon: <TrendUp className="w-5 h-5 text-accent" />,
    },
    {
      value: "all",
      label: "All of the above",
      description: "Complete tender intelligence platform",
      icon: <Lightning className="w-5 h-5 text-secondary" />,
    },
  ];

  const referralSources = [
    "Google Search",
    "LinkedIn",
    "Industry Publication",
    "Colleague Referral",
    "Conference/Event",
    "Social Media",
    "Government Website",
    "Other",
  ];

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      primary_services: prev.primary_services.includes(service)
        ? prev.primary_services.filter((s) => s !== service)
        : [...prev.primary_services, service],
    }));
  };

  const handleRegionToggle = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      service_regions: prev.service_regions.includes(region)
        ? prev.service_regions.filter((r) => r !== region)
        : [...prev.service_regions, region],
    }));
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Authentication error. Please sign in again.");
        navigate("/sign-in");
        return;
      }

      // Create or update profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        ...formData,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile update error:", profileError);
        setError("Failed to save profile. Please try again.");
        return;
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return (
          formData.company_name &&
          formData.company_size &&
          formData.annual_revenue
        );
      case 2:
        return formData.industry && formData.business_type;
      case 3:
        return (
          formData.primary_services.length > 0 &&
          formData.headquarters_province &&
          formData.service_regions.length > 0
        );
      case 4:
        return (
          formData.government_experience &&
          formData.annual_bid_volume &&
          formData.typical_contract_size
        );
      case 5:
        return formData.primary_use_case && formData.referral_source;
      default:
        return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Company Basics";
      case 2:
        return "Business Type";
      case 3:
        return "Services & Coverage";
      case 4:
        return "Procurement Experience";
      case 5:
        return "Goals & Preferences";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Procuroo
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-light">
              Step {step} of 5: {getStepTitle()}
            </span>
            <div className="w-40 bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Company Basics */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <Building className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-text mb-3">
                Tell us about your company
              </h1>
              <p className="text-lg text-text-light">
                This helps us show you the most relevant tender opportunities
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    company_name: e.target.value,
                  }))
                }
                className="w-full px-4 py-4 border border-border rounded-xl bg-surface focus:border-primary focus:outline-none text-lg"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Company Size *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {companySizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        company_size: size.value,
                      }))
                    }
                    className={`p-4 border rounded-xl text-left transition-all hover:scale-[1.02] ${
                      formData.company_size === size.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-sm text-text-light">
                      {size.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Annual Revenue *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {revenueRanges.map((revenue) => (
                  <button
                    key={revenue.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        annual_revenue: revenue.value,
                      }))
                    }
                    className={`p-4 border rounded-xl text-left transition-all hover:scale-[1.02] ${
                      formData.annual_revenue === revenue.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="font-medium">{revenue.label}</div>
                    <div className="text-sm text-text-light">
                      {revenue.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Type */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-text mb-3">
                What type of business are you?
              </h1>
              <p className="text-lg text-text-light">
                Understanding your business helps us customize your experience
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Primary Industry *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        industry: industry.value,
                      }))
                    }
                    className={`p-4 border rounded-xl text-center transition-all hover:scale-[1.02] ${
                      formData.industry === industry.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {industry.icon}
                    </div>
                    <div className="font-medium text-sm">{industry.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Business Structure *
              </label>
              <div className="space-y-3">
                {businessTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        business_type: type.value,
                      }))
                    }
                    className={`w-full p-4 border rounded-xl text-left transition-all hover:scale-[1.01] ${
                      formData.business_type === type.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-text-light">
                      {type.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services & Coverage */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-text mb-3">
                Your services and coverage
              </h1>
              <p className="text-lg text-text-light">
                Help us understand what you do and where you can deliver
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Primary Services * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {services.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`p-3 border rounded-lg text-left text-sm transition-all hover:scale-[1.02] ${
                      formData.primary_services.includes(service)
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-light mt-2">
                Selected: {formData.primary_services.length} services
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Headquarters Province *
              </label>
              <select
                value={formData.headquarters_province}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    headquarters_province: e.target.value,
                  }))
                }
                className="w-full px-4 py-4 border border-border rounded-xl bg-surface focus:border-primary focus:outline-none text-lg"
              >
                <option value="">Select your headquarters province</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Service Regions * (Where can you deliver services?)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-border rounded-xl p-4">
                {provinces.map((province) => (
                  <button
                    key={province}
                    type="button"
                    onClick={() => handleRegionToggle(province)}
                    className={`p-2 border rounded text-sm text-left transition-all hover:scale-[1.02] ${
                      formData.service_regions.includes(province)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {province}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-light mt-2">
                Selected: {formData.service_regions.length} regions
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Procurement Experience */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-text mb-3">
                Your procurement experience
              </h1>
              <p className="text-lg text-text-light">
                This helps us customize the platform to your experience level
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Government Contract Experience *
              </label>
              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        government_experience: level.value,
                      }))
                    }
                    className={`w-full p-4 border rounded-xl text-left transition-all hover:scale-[1.01] ${
                      formData.government_experience === level.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {level.icon}
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-text-light">
                          {level.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Annual Bid Volume *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: "0", label: "Haven't bid yet" },
                  { value: "1-5", label: "1-5 bids" },
                  { value: "6-20", label: "6-20 bids" },
                  { value: "21-50", label: "21-50 bids" },
                  { value: "50+", label: "50+ bids" },
                  { value: "100+", label: "100+ bids" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        annual_bid_volume: option.value,
                      }))
                    }
                    className={`p-4 border rounded-xl text-center transition-all hover:scale-[1.02] ${
                      formData.annual_bid_volume === option.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Typical Contract Size You Target *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contractSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        typical_contract_size: size.value,
                      }))
                    }
                    className={`p-4 border rounded-xl text-left transition-all hover:scale-[1.02] ${
                      formData.typical_contract_size === size.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-sm text-text-light">
                      {size.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Goals & Preferences */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <Lightning className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-text mb-3">
                Almost done!
              </h1>
              <p className="text-lg text-text-light">
                Let's understand your goals so we can personalize your
                experience
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                Primary Goal with Procuroo *
              </label>
              <div className="space-y-3">
                {useCases.map((useCase) => (
                  <button
                    key={useCase.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_use_case: useCase.value,
                      }))
                    }
                    className={`w-full p-4 border rounded-xl text-left transition-all hover:scale-[1.01] ${
                      formData.primary_use_case === useCase.value
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "border-border hover:border-primary hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {useCase.icon}
                      <div>
                        <div className="font-medium">{useCase.label}</div>
                        <div className="text-sm text-text-light">
                          {useCase.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-3">
                How did you hear about us? *
              </label>
              <select
                value={formData.referral_source}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    referral_source: e.target.value,
                  }))
                }
                className="w-full px-4 py-4 border border-border rounded-xl bg-surface focus:border-primary focus:outline-none text-lg"
              >
                <option value="">Select referral source</option>
                {referralSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2 px-6 py-3 text-text-light hover:text-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
          >
            {loading ? (
              "Saving..."
            ) : step === 5 ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete Setup
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-text-light hover:text-text text-sm transition-colors underline"
          >
            Skip for now, I'll complete this later
          </button>
        </div>
      </div>
    </div>
  );
}
