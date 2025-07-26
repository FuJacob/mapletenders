import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Crown,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react";
import { useAuth } from "../hooks/auth";
import { useAppDispatch } from "../app/hooks";
import { updateProfile } from "../features/auth/authThunks";
import { useSubscription } from "../hooks/useSubscription";

import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  StatusMessages,
  companySizes,
  industries,
  services,
  experienceLevels,
  contractSizes,
  canadianProvinces,
  getIndustryDisplay,
  getExperienceDisplay,
  getContractSizeDisplay,
  getCompanySizeDisplay,
} from "../components/profile";

export default function Profile() {
  const { user, profile } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
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

  // Helper functions for plan display
  const getPlanDisplayName = (planId: string) => {
    switch (planId) {
      case "starter": return "Starter";
      case "professional": return "Professional";
      case "enterprise": return "Enterprise";
      default: return planId;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600";
      case "trialing": return "text-blue-600";
      case "past_due": return "text-yellow-600";
      case "canceled": return "text-red-600";
      default: return "text-text-light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "trialing": return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-text-light" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text">Profile</h1>
            <p className="text-text-light">Manage your profile and preferences</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-border text-text rounded-lg hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
        <StatusMessages success={success} error={error} />
      </div>

      {/* Dashboard Grid */}
      <div className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
          
          {/* Current Plan Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Current Plan</h3>
            </div>
            {subscriptionLoading ? (
              <div className="text-center py-4">
                <LoadingSpinner variant="inline" size="sm" showLogo={false} />
              </div>
            ) : !subscription ? (
              <div className="text-center py-4">
                <p className="text-text-light text-sm mb-3">No active subscription</p>
                <a
                  href="/plans"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark transition-colors"
                >
                  Choose Plan
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-light text-sm">Plan:</span>
                  <span className="font-medium text-sm">{getPlanDisplayName(subscription.plan_id)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-light text-sm">Status:</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(subscription.status)}
                    <span className={`text-sm ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </div>
                </div>
                {subscription.current_period_end && (
                  <div className="flex justify-between">
                    <span className="text-text-light text-sm">Next Billing:</span>
                    <span className="text-sm">{formatDate(subscription.current_period_end)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Company Information Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Company Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-light mb-1">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-border rounded text-sm bg-background focus:border-primary focus:outline-none"
                    placeholder="Enter company name"
                  />
                ) : (
                  <p className="text-sm">{profile?.company_name || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-text-light mb-1">Industry</label>
                {isEditing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-border rounded text-sm bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry.value} value={industry.value}>{industry.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm">{profile?.industry ? getIndustryDisplay(profile.industry) : "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-text-light mb-1">Company Size</label>
                {isEditing ? (
                  <select
                    value={formData.company_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-border rounded text-sm bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select company size</option>
                    {companySizes.map((size) => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm">{profile?.company_size ? getCompanySizeDisplay(profile.company_size) : "Not set"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Primary Services Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Primary Services</h3>
            </div>
            {isEditing ? (
              <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto border border-border rounded p-2">
                {services.slice(0, 8).map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`p-1.5 border rounded text-xs text-left transition-all ${
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
              <div className="flex flex-wrap gap-1">
                {profile?.primary_services && profile.primary_services.length > 0 ? (
                  profile.primary_services.map((service: string) => (
                    <span key={service} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-text-light text-sm">No services selected</p>
                )}
              </div>
            )}
          </div>

          {/* Service Regions Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Service Regions</h3>
            </div>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto border border-border rounded p-2">
                {canadianProvinces.map((province) => (
                  <button
                    key={province}
                    type="button"
                    onClick={() => handleRegionToggle(province)}
                    className={`p-1 border rounded text-xs text-left transition-all ${
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
              <div className="flex flex-wrap gap-1">
                {profile?.service_regions && profile.service_regions.length > 0 ? (
                  profile.service_regions.map((region: string) => (
                    <span key={region} className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">
                      {region}
                    </span>
                  ))
                ) : (
                  <p className="text-text-light text-sm">No regions selected</p>
                )}
              </div>
            )}
          </div>

          {/* Experience Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Experience</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-light mb-1">Government Experience</label>
                {isEditing ? (
                  <select
                    value={formData.government_experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, government_experience: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-border rounded text-sm bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select experience level</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm">{profile?.government_experience ? getExperienceDisplay(profile.government_experience) : "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-text-light mb-1">Typical Contract Size</label>
                {isEditing ? (
                  <select
                    value={formData.typical_contract_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, typical_contract_size: e.target.value }))}
                    className="w-full px-2 py-1.5 border border-border rounded text-sm bg-background focus:border-primary focus:outline-none"
                  >
                    <option value="">Select contract size</option>
                    {contractSizes.map((size) => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm">{profile?.typical_contract_size ? getContractSizeDisplay(profile.typical_contract_size) : "Not set"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings Box */}
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-text">Account Settings</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-light mb-1">Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="flex-1 px-2 py-1.5 border border-border rounded bg-surface-muted text-text-muted text-sm"
                  />
                  <button className="px-2 py-1.5 text-xs border border-border rounded hover:bg-border transition-colors">
                    Change
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-light mb-1">Password</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="••••••••"
                    disabled
                    className="flex-1 px-2 py-1.5 border border-border rounded bg-surface-muted text-text-muted text-sm"
                  />
                  <button className="px-2 py-1.5 text-xs border border-border rounded hover:bg-border transition-colors">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
