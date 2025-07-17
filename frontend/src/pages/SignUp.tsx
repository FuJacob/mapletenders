import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  Lightning,
  CheckCircle,
  ArrowLeft,
  Target,
  TrendUp,
  Shield,
} from "@phosphor-icons/react";
import { signUpUser } from "../api";
import { useAppDispatch } from "../app/hooks";

import {
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { setAuthLoading, setAuthError } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SignUp() {
  const dispatch = useAppDispatch();
  dispatch(setAuthError(null));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isAuthLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setAuthError("Please agree to the terms and conditions");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setAuthError("Passwords don't match");
      return;
    }

    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));

    try {
      const response = await signUpUser({
        email: formData.email,
        password: formData.password,
      });
      console.log("SignUp response:", response);
      if (response.session == null) {
        setAuthError("An unexpected error occurred");
      } else {
        navigate("/sign-in?confirm-email=true");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isFormValid =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    isPasswordMatch &&
    agreedToTerms;

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-surface items-center justify-center px-12">
        <div className="max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-primary rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Start Your 14-Day Free Trial
            </div>
            <h2 className="text-3xl font-semibold text-text mb-4">
              Win more government contracts
            </h2>
            <p className="text-lg text-text-muted">
              Join 2,847+ Canadian contractors already using AI to discover and
              win government tenders.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Lightning className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  Find opportunities 10x faster
                </div>
                <div className="text-text-muted">
                  Our AI understands your business and finds relevant Canadian
                  government contracts instantly.
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
                <div className="text-text-muted">
                  AI-powered matching helps you focus on contracts you can
                  actually win.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-text mb-1">
                  Never miss deadlines
                </div>
                <div className="text-text-muted">
                  Smart alerts ensure you're always first to know about new
                  opportunities.
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-bg rounded-lg p-6 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-success rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-secondary rounded-full border-2 border-white"></div>
              </div>
              <div className="text-sm text-text-muted">
                <span className="font-semibold text-text">
                  2,847+ contractors
                </span>{" "}
                already winning with MapleTenders
              </div>
            </div>
            <div className="text-sm text-text-muted italic">
              "We found $2.3M in contracts in our first 6 months. Best
              investment we've made."
            </div>
            <div className="text-xs text-text-muted mt-2">
              — Sarah Chen, TechFlow Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
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
              Start winning today
            </h1>
            <p className="text-text-muted">
              Create your account and discover government contracts
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              No credit card required
            </span>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-text mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-surface text-text placeholder-text-muted pr-12 ${
                    formData.confirmPassword && !isPasswordMatch
                      ? "border-error focus:border-error"
                      : "border-border focus:border-primary"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showConfirmPassword ? (
                    <EyeSlash className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !isPasswordMatch && (
                <p className="text-error text-sm mt-1">Passwords don't match</p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-text-muted">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:opacity-80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:opacity-80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isAuthLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Creating your account...
                </>
              ) : (
                "Start my free trial"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-primary hover:opacity-80 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Trust Signals */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
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
