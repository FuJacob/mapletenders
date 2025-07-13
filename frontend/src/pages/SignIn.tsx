import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  ArrowLeft,
  CheckCircle,
  Target,
  TrendUp,
  Lightning,
} from "@phosphor-icons/react";

import { useSelector } from "react-redux";
import { selectAuthLoading } from "../features/auth/authSelectors";

import { signIn } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { selectAuthError } from "../features/auth/authSelectors";
import { LogoTitle } from "../components/ui/LogoTitle";
import { setAuthError } from "../features/auth/authSlice";

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
  dispatch(setAuthError(null));

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
    <div className="min-h-screen bg-bg flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <div className="mb-4">
              <LogoTitle size="text-2xl" />
            </div>
            <h1 className="text-2xl font-semibold text-text mb-2">
              Welcome back
            </h1>
            <p className="text-text-muted">
              Sign in to continue finding government contracts
            </p>
          </div>

          {/* Success Message */}
          {needToConfirmEmail && (
            <div className="mb-6 p-4 bg-secondary border border-success/20 rounded-lg text-text">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium">
                  Account created successfully!
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                Please check your inbox and click the confirmation link to
                activate your account.
              </p>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted"
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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
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
              <div className="text-sm text-text-muted">Stay signed in</div>
              <Link
                to="/reset-password"
                className="text-sm text-primary hover:opacity-80"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary hover:opacity-80 font-medium"
              >
                Start your free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-surface items-center justify-center px-12">
        <div className="max-w-lg">
          <h2 className="text-3xl font-semibold text-text mb-6">
            Your next contract is waiting
          </h2>
          <p className="text-lg text-text-muted mb-8">
            Join Canadian contractors already winning government tenders with
            AI-powered discovery.
          </p>

          {/* Success Stories */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  $1.2M in contracts found
                </div>
                <div className="text-sm text-text-muted">
                  "MapleTenders helped us discover opportunities we never would
                  have found manually."
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  95% time saved on search
                </div>
                <div className="text-sm text-text-muted">
                  "The AI matches help us focus on contracts we can actually
                  win."
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                <Lightning className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  Never miss deadlines
                </div>
                <div className="text-sm text-text-muted">
                  "Smart alerts ensure we're always first to know about new
                  opportunities."
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Enterprise Security
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                99.9% Uptime
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                2,847+ Users
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                $3.2B Tracked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
