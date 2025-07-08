import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  Lightning,
  CheckCircle,
  ArrowLeft,
  Target,
  TrendUp,
} from "@phosphor-icons/react";

import { useSelector } from "react-redux";
import { selectAuthLoading } from "../features/auth/authSelectors";

import { signIn } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { selectAuthError } from "../features/auth/authSelectors";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SignIn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [needToConfirmEmail] = useState(
    searchParams.get("confirm-email") === "true"
  );
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const isAuthLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({});
    dispatch(signIn(form.email, form.password));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <LogoTitle size="text-3xl" />
            <h1 className="text-2xl font-bold text-text mb-2">Welcome back</h1>
            <p className="text-text-light">
              Sign in to continue finding winning opportunities
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}

            {needToConfirmEmail && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-900">
                🎉 You're almost there! Please check your inbox and click the
                confirmation link to activate your account and continue.
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                {authError}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleOnChange}
                placeholder="your@company.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleOnChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light hover:text-text"
                >
                  {showPassword ? (
                    <EyeSlash className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm text-text">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lightning className="w-4 h-4" />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-light">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Start your free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Motivation & Stats */}
      <div className="hidden lg:flex flex-1 bg-surface items-center justify-center px-12">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold text-text mb-6">
            Your next big contract is waiting
          </h2>
          <p className="text-lg text-text-light mb-8">
            Join thousands of businesses already winning government contracts
            with AI-powered tender discovery.
          </p>

          {/* Success Stories */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  Found $1.2M in contracts
                </div>
                <div className="text-sm text-text-light">
                  "MapleBids helped us discover opportunities we never would
                  have found manually."
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  300% increase in bid success
                </div>
                <div className="text-sm text-text-light">
                  "The AI win probability feature helps us focus on the right
                  opportunities."
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Lightning className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  20 hours saved per week
                </div>
                <div className="text-sm text-text-light">
                  "No more manual searching through government websites."
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-4 text-sm text-text-light">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                Enterprise Security
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-success" />
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
