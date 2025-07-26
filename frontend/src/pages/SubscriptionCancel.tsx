import { Link } from "react-router-dom";
import { XCircle, Lightning, ArrowLeft } from "@phosphor-icons/react";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SubscriptionCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <LogoTitle size="text-3xl" />
        </div>

        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-error/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-8 h-8 text-error" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-text mb-4">
            Subscription Cancelled
          </h1>

          <p className="text-text-light mb-6">
            No worries! Your subscription setup was cancelled and no charges
            have been made to your account.
          </p>

          <div className="bg-background rounded-lg p-4 mb-6">
            <p className="text-sm text-text-light">
              You can still try MapleBids with our free plan or return to
              complete your subscription at any time.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/pricing"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
          >
            <Lightning className="w-4 h-4" />
            Try Again
          </Link>

          <Link
            to="/home"
            className="w-full px-6 py-3 border border-border text-text rounded-lg font-medium hover:bg-surface transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue with Free Plan
          </Link>
        </div>

        <div className="mt-8 p-4 bg-surface rounded-lg">
          <h3 className="font-semibold text-text mb-2">Need help?</h3>
          <p className="text-sm text-text-light mb-3">
            Have questions about our plans or pricing? We're here to help.
          </p>
          <Link
            to="/contact"
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
