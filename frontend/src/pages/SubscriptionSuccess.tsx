import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Lightning, ArrowRight } from "@phosphor-icons/react";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay to allow Stripe webhook to process
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Lightning className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-text mb-2">
            Setting up your subscription...
          </h1>
          <p className="text-text-light">This will only take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <LogoTitle size="text-3xl" />
        </div>

        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text mb-4">
            Welcome to MapleBids!
          </h1>

          <p className="text-text-light mb-6">
            Your subscription has been activated successfully. You now have
            access to all premium features and your 14-day free trial has begun.
          </p>

          <div className="space-y-4 text-sm text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-text">14-day free trial activated</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-text">Access to all premium features</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-text">Priority customer support</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              <span className="text-text">No charges until trial ends</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/home"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/profile"
            className="w-full px-6 py-3 border border-border text-text rounded-lg font-medium hover:bg-surface transition-colors block"
          >
            Manage Subscription
          </Link>
        </div>

        {sessionId && (
          <p className="text-xs text-text-light mt-6">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
