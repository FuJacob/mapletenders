import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Crown,
  CheckCircle,
  Clock,
  PersonIcon,
  Lightning,
  ArrowUp,
  ArrowDown,
  GearSix,
} from "@phosphor-icons/react";
import { useAuth } from "../hooks/auth";
import { useAppDispatch } from "../app/hooks";
import { updateProfile } from "../features/auth/authThunks";
import { useSubscription } from "../hooks/useSubscription";
import { 
  getPlans, 
  createCheckoutSession, 
  createBillingPortalSession,
  type Plan 
} from "../api/subscriptions";
import { changePassword, resetPassword } from "../api/auth";

import LoadingSpinner from "../components/common/LoadingSpinner";
import {
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
import { PageHeader } from "../components/ui";

export default function Profile() {
  const { user, profile } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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

  // Fetch available plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getPlans();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setPlansLoading(false);
      }
    };
    fetchPlans();
  }, []);

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

    try {
      // Dispatch the update profile thunk
      const result = await dispatch(updateProfile(formData));

      if (result.type === "auth/updateProfile/fulfilled") {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
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
  };

  // Handle plan upgrade/downgrade
  const handlePlanChange = async (newPlan: Plan, billingCycle: "monthly" | "yearly") => {
    if (!user) return;

    setUpgradeLoading(newPlan.id);
    try {
      const response = await createCheckoutSession(
        newPlan.id,
        billingCycle,
        user.id,
        user.email || "",
        user.user_metadata?.full_name || ""
      );

      if (response.error) {
        console.error("Checkout error:", response.error);
        alert("Something went wrong. Please try again.");
      } else if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Plan change error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpgradeLoading(null);
    }
  };

  // Handle billing portal
  const handleManageBilling = async () => {
    if (!user) return;

    setBillingLoading(true);
    try {
      const response = await createBillingPortalSession(user.id);
      
      if (response.error) {
        console.error("Billing portal error:", response.error);
        alert("Something went wrong. Please try again.");
      } else if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Billing portal error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setBillingLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    try {
      const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (response.error) {
        setPasswordError(response.error);
      } else {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordChange(false);
      }
    } catch (error) {
      console.error("Password change error:", error);
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const response = await resetPassword(user.email);
      if (response.error) {
        setPasswordError(response.error);
      } else {
        setPasswordSuccess("Password reset email sent! Check your inbox.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setPasswordError("Something went wrong. Please try again.");
    }
  };

  // Helper functions for plan display
  const getPlanDisplayName = (planId: string) => {
    switch (planId) {
      case "starter":
        return "Starter";
      case "professional":
        return "Professional";
      case "enterprise":
        return "Enterprise";
      default:
        return planId;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success";
      case "trialing":
        return "text-info";
      case "past_due":
        return "text-warning";
      case "canceled":
        return "text-error";
      default:
        return "text-text-light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "trialing":
        return <Clock className="w-5 h-5 text-info" />;
      default:
        return <Clock className="w-5 h-5 text-text-light" />;
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
    <div className="min-h-full bg-background">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Profile Settings"
          description="Manage your company information and account preferences"
          icon={<PersonIcon className="w-8 h-8 text-primary" />}
        />
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-border text-text rounded-lg hover:bg-surface-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-maple/10 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-maple" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text">
                    Current Plan
                  </h2>
                  <p className="text-text-muted text-sm">
                    Your subscription details
                  </p>
                </div>
              </div>
              {subscriptionLoading ? (
                <div className="text-center py-8">
                  <LoadingSpinner variant="inline" size="sm" showLogo={false} />
                </div>
              ) : !subscription ? (
                <div className="bg-surface-warm rounded-lg p-6 text-center">
                  <p className="text-text-muted mb-4">No active subscription</p>
                  <a
                    href="/plans"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                  >
                    Choose Plan
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-text-muted font-medium">Plan</span>
                    <span className="font-semibold text-lg text-text">
                      {getPlanDisplayName(subscription.plan_id)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-text-muted font-medium">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <span
                        className={`font-medium capitalize ${getStatusColor(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-text-muted font-medium">Billing Cycle</span>
                    <span className="font-medium text-text capitalize">
                      {subscription.billing_cycle}
                    </span>
                  </div>
                  {subscription.current_period_end && (
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-text-muted font-medium">
                        Next Billing
                      </span>
                      <span className="font-medium text-text">
                        {formatDate(subscription.current_period_end)}
                      </span>
                    </div>
                  )}
                  
                  {/* Plan Management Actions */}
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleManageBilling}
                      disabled={billingLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-surface-muted transition-colors disabled:opacity-50"
                    >
                      {billingLoading ? (
                        <>
                          <Lightning className="w-4 h-4 animate-pulse" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <GearSix className="w-4 h-4" />
                          Manage Billing
                        </>
                      )}
                    </button>
                    
                    {/* Show upgrade options if not on highest plan */}
                    {!plansLoading && plans.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-text-muted">Available Plans:</p>
                        {plans
                          .filter(plan => plan.id !== subscription.plan_id)
                          .map((plan) => {
                            const currentPlan = plans.find(p => p.id === subscription.plan_id);
                            const isUpgrade = currentPlan && plan.price_monthly > currentPlan.price_monthly;
                            const isProcessing = upgradeLoading === plan.id;
                            
                            return (
                              <button
                                key={plan.id}
                                onClick={() => handlePlanChange(plan, subscription.billing_cycle as "monthly" | "yearly")}
                                disabled={isProcessing}
                                className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/20 transition-colors disabled:opacity-50"
                              >
                                <div className="flex items-center gap-3">
                                  {isUpgrade ? (
                                    <ArrowUp className="w-4 h-4 text-success" />
                                  ) : (
                                    <ArrowDown className="w-4 h-4 text-warning" />
                                  )}
                                  <div className="text-left">
                                    <div className="font-medium text-text">{plan.name}</div>
                                    <div className="text-sm text-text-muted">
                                      ${subscription.billing_cycle === "yearly" 
                                        ? Math.round(plan.price_yearly / 12) 
                                        : plan.price_monthly}/month
                                    </div>
                                  </div>
                                </div>
                                {isProcessing ? (
                                  <Lightning className="w-4 h-4 animate-pulse text-primary" />
                                ) : (
                                  <span className="text-sm text-primary font-medium">
                                    {isUpgrade ? "Upgrade" : "Downgrade"}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Company Information Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text">
                    Company Information
                  </h2>
                  <p className="text-text-muted text-sm">
                    Basic company details
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
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
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <p className="text-base font-medium text-text">
                      {profile?.company_name || "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
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
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry.value} value={industry.value}>
                          {industry.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base font-medium text-text">
                      {profile?.industry
                        ? getIndustryDisplay(profile.industry)
                        : "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
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
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select company size</option>
                      {companySizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base font-medium text-text">
                      {profile?.company_size
                        ? getCompanySizeDisplay(profile.company_size)
                        : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Primary Services Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-info" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text">
                    Primary Services
                  </h2>
                  <p className="text-text-muted text-sm">
                    Services you provide
                  </p>
                </div>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto border border-border rounded-lg p-4">
                  {services.slice(0, 8).map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceToggle(service)}
                      className={`p-3 border rounded-lg text-sm text-left transition-all ${
                        formData.primary_services.includes(service)
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border hover:border-primary hover:bg-surface-muted"
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
                        className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                      >
                        {service}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-muted">No services selected</p>
                  )}
                </div>
              )}
            </div>

            {/* Service Regions Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text">
                    Service Regions
                  </h2>
                  <p className="text-text-muted text-sm">Areas you serve</p>
                </div>
              </div>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-border rounded-lg p-4">
                  {canadianProvinces.map((province) => (
                    <button
                      key={province}
                      type="button"
                      onClick={() => handleRegionToggle(province)}
                      className={`p-3 border rounded-lg text-sm text-left transition-all ${
                        formData.service_regions.includes(province)
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-border hover:border-accent hover:bg-surface-muted"
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
                        className="px-3 py-2 bg-accent/10 text-accent rounded-lg text-sm font-medium"
                      >
                        {region}
                      </span>
                    ))
                  ) : (
                    <p className="text-text-muted">No regions selected</p>
                  )}
                </div>
              )}
            </div>

            {/* Experience Card */}
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text">
                    Experience
                  </h2>
                  <p className="text-text-muted text-sm">
                    Your expertise level
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
                    Government Experience
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
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select experience level</option>
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base font-medium text-text">
                      {profile?.government_experience
                        ? getExperienceDisplay(profile.government_experience)
                        : "Not set"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-3">
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
                      className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="">Select contract size</option>
                      {contractSizes.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base font-medium text-text">
                      {profile?.typical_contract_size
                        ? getContractSizeDisplay(profile.typical_contract_size)
                        : "Not set"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings - Full Width */}
        <div className="mt-8">
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text">
                  Account Settings
                </h2>
                <p className="text-text-muted text-sm">
                  Manage your login credentials
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Email Address
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="flex-1 px-4 py-3 border border-border rounded-lg bg-surface-muted text-text-muted"
                  />
                  <button className="px-6 py-3 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors font-medium">
                    Change
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-3">
                  Password
                </label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="password"
                      value="••••••••"
                      disabled
                      className="flex-1 px-4 py-3 border border-border rounded-lg bg-surface-muted text-text-muted"
                    />
                    <button
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="px-6 py-3 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors font-medium"
                    >
                      Change
                    </button>
                    <button
                      onClick={handlePasswordReset}
                      className="px-6 py-3 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors font-medium text-primary"
                    >
                      Reset
                    </button>
                  </div>
                  
                  {/* Password Change Form */}
                  {showPasswordChange && (
                    <div className="border border-border rounded-lg p-4 space-y-4 bg-surface-muted">
                      <h4 className="font-medium text-text">Change Password</h4>
                      
                      {passwordError && (
                        <div className="p-3 bg-error/10 border border-error/20 text-error rounded-lg text-sm">
                          {passwordError}
                        </div>
                      )}
                      
                      {passwordSuccess && (
                        <div className="p-3 bg-success/10 border border-success/20 text-success rounded-lg text-sm">
                          {passwordSuccess}
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                          placeholder="Enter new password"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:border-primary focus:outline-none transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setShowPasswordChange(false)}
                          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePasswordChange}
                          disabled={passwordLoading}
                          className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {passwordLoading ? (
                            <>
                              <Lightning className="w-4 h-4 animate-pulse" />
                              Changing...
                            </>
                          ) : (
                            "Change Password"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
