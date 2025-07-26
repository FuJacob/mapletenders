import { useState, useEffect } from "react";
import { FloppyDisk, X, User, Briefcase, Crown } from "@phosphor-icons/react";
import { useAuth } from "../hooks/auth";
import { useAppDispatch } from "../app/hooks";
import { updateProfile } from "../features/auth/authThunks";

import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  ProfileHeader,
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

  if (!user) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <ProfileHeader
          profile={profile ?? null}
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
        />

        <StatusMessages success={success} error={error} />
      </div>

      <div className="flex-1 overflow-auto">
        {/* Profile Content */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Basic Information */}
          <div className="bg-surface border border-border rounded-lg p-6">
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
          <div className="bg-surface border border-border rounded-lg p-6">
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
                  {profile?.primary_services &&
                  profile.primary_services.length > 0 ? (
                    profile.primary_services.map((service: string) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
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
                  {profile?.service_regions &&
                  profile.service_regions.length > 0 ? (
                    profile.service_regions.map((region: string) => (
                      <span
                        key={region}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-lg text-sm"
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
          <div className="bg-surface border border-border rounded-lg p-6">
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
