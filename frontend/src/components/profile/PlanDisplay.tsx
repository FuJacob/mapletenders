import { Crown, Clock, CheckCircle } from "@phosphor-icons/react";
import { useSubscription } from "../../hooks/useSubscription";
import LoadingSpinner from "../common/LoadingSpinner";

export default function PlanDisplay() {
  const { subscription, loading, error } = useSubscription();

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <LoadingSpinner message="Loading plan information..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center text-text-light">
          <p>Unable to load plan information</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text">Current Plan</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-text-light mb-2">No active subscription</p>
          <a
            href="/plans"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Crown className="w-4 h-4" />
            Choose a Plan
          </a>
        </div>
      </div>
    );
  }

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
        return "text-green-600";
      case "trialing":
        return "text-blue-600";
      case "past_due":
        return "text-yellow-600";
      case "canceled":
        return "text-red-600";
      default:
        return "text-text-light";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "trialing":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-text-light" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-text">Current Plan</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-text-light">Plan:</span>
          <span className="font-medium text-text">
            {getPlanDisplayName(subscription.plan_id)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-light">Status:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(subscription.status)}
            <span
              className={`font-medium ${getStatusColor(subscription.status)}`}
            >
              {subscription.status.charAt(0).toUpperCase() +
                subscription.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-light">Billing Cycle:</span>
          <span className="font-medium text-text capitalize">
            {subscription.billing_cycle}
          </span>
        </div>

        {subscription.current_period_end && (
          <div className="flex items-center justify-between">
            <span className="text-text-light">Next Billing:</span>
            <span className="font-medium text-text">
              {formatDate(subscription.current_period_end)}
            </span>
          </div>
        )}

        {subscription.trial_end && (
          <div className="flex items-center justify-between">
            <span className="text-text-light">Trial Ends:</span>
            <span className="font-medium text-text">
              {formatDate(subscription.trial_end)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <a
          href="/plans"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Crown className="w-4 h-4" />
          Manage Subscription
        </a>
      </div>
    </div>
  );
}
