import { useState, useEffect } from "react";
import {
  Building,
  Briefcase,
  CheckCircle,
  User,
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
  PencilSimple,
  FloppyDisk,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "../hooks/auth";
import { useAppDispatch } from "../app/hooks";
import { updateProfile } from "../features/auth/authThunks";

import LoadingSpinner from "../components/common/LoadingSpinner";

export default function Profile() {
  const { user, profile } = useAuth();
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data initialized with profile data
  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    company_size: profile?.company_size || "",
    industry: profile?.industry || "",
    primary_services: profile?.primary_services || [],
    service_regions: profile?.service_regions || [],
    government_experience: profile?.government_experience || "",
    typical_contract_size: profile?.typical_contract_size || "",
  });

  // Reset form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        company_size: profile.company_size || "",
        industry: profile.industry || "",
        primary_services: profile.primary_services || [],
        service_regions: profile.service_regions || [],
        government_experience: profile.government_experience || "",
        typical_contract_size: profile.typical_contract_size || "",
      });
    }
  }, [profile]);

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

  const canadianProvinces = [
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

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      primary_services: prev.primary_services.includes(service)
        ? prev.primary_services.filter((s: string) => s !== service)
        : [...prev.primary_services, service],
    }));
  };

  const handleRegionToggle = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      service_regions: prev.service_regions.includes(region)
        ? prev.service_regions.filter((r: string) => r !== region)
        : [...prev.service_regions, region],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Dispatch the update profile thunk
      const result = await dispatch(updateProfile(formData));

      if (result.type === "auth/updateProfile/fulfilled") {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile) {
      setFormData({
        company_name: profile.company_name || "",
        company_size: profile.company_size || "",
        industry: profile.industry || "",
        primary_services: profile.primary_services || [],
        service_regions: profile.service_regions || [],
        government_experience: profile.government_experience || "",
        typical_contract_size: profile.typical_contract_size || "",
      });
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const getIndustryDisplay = (value: string) => {
    const industry = industries.find((i) => i.value === value);
    return industry ? industry.label : value;
  };

  const getExperienceDisplay = (value: string) => {
    const experience = experienceLevels.find((e) => e.value === value);
    return experience ? experience.label : value;
  };

  const getContractSizeDisplay = (value: string) => {
    const size = contractSizes.find((s) => s.value === value);
    return size ? size.label : value;
  };

  const getCompanySizeDisplay = (value: string) => {
    const size = companySizes.find((s) => s.value === value);
    return size ? size.label : value;
  };

  if (!user) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
              {profile?.company_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text">
                {profile?.company_name || "Your Company"}
              </h1>
              <p className="text-text-light">
                {profile?.industry
                  ? getIndustryDisplay(profile.industry)
                  : "Company Profile"}
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <PencilSimple className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Content */}
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company_name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                    placeholder="Enter company name"
                  />
                ) : (
                  <p className="text-text-light">
                    {profile?.company_name || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Company Size
                </label>
                {isEditing ? (
                  <select
                    value={formData.company_size}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company_size: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-text-light">
                    {profile?.company_size
                      ? getCompanySizeDisplay(profile.company_size)
                      : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Industry
                </label>
                {isEditing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-text-light">
                    {profile?.industry
                      ? getIndustryDisplay(profile.industry)
                      : "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Services & Regions */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Services & Regions
            </h2>

            {/* Primary Services */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-3">
                Primary Services
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                  {services.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-2 border rounded text-sm text-left transition-all ${
                        formData.primary_services.includes(service)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.primary_services && profile.primary_services.length > 0 ? (
                    profile.primary_services.map((service: string) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-light">No services selected</p>
                  )}
                </div>
              )}
            </div>

            {/* Service Regions */}
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                Service Regions
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                  {canadianProvinces.map((province) => (
                    <button
                      key={province}
                      type="button"
                      onClick={() => handleRegionToggle(province)}
                      className={`p-2 border rounded text-sm text-left transition-all ${
                        formData.service_regions.includes(province)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {province}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.service_regions && profile.service_regions.length > 0 ? (
                    profile.service_regions.map((region: string) => (
                      <span
                        key={region}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                      >
                        {region}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-light">No regions selected</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Experience & Preferences */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Experience & Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Government Contract Experience
                </label>
                {isEditing ? (
                  <select
                    value={formData.government_experience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        government_experience: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-text-light">
                    {profile?.government_experience
                      ? getExperienceDisplay(profile.government_experience)
                      : "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Typical Contract Size
                </label>
                {isEditing ? (
                  <select
                    value={formData.typical_contract_size}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        typical_contract_size: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select contract size</option>
                    {contractSizes.map((size) => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-text-light">
                    {profile?.typical_contract_size
                      ? getContractSizeDisplay(profile.typical_contract_size)
                      : "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Editing */}
          {isEditing && (
            <div className="flex justify-end gap-4 pt-4 border-t border-border">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 border border-border text-text hover:bg-border transition-colors rounded-lg"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <FloppyDisk className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
