import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  Lightning,
  CheckCircle,
  ArrowLeft,
  Crown,
  Shield,
  Users,
  TrendUp,
  Clock,
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
      if (response.error) {
        setAuthError(response.error);
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
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Motivation & Benefits */}
      <div className="hidden lg:flex flex-1 bg-surface items-center justify-center px-12">
        <div className="max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              Start Your 14-Day Free Trial
            </div>
            <h2 className="text-4xl font-bold text-text mb-4">
              Win more government contracts
            </h2>
            <p className="text-lg text-text-light">
              Join 5,000+ businesses already using AI to discover and win
              government tenders.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Lightning className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="font-semibold text-text text-lg mb-2">
                  Find opportunities 10x faster
                </div>
                <div className="text-text-light">
                  Stop spending hours on manual searches. Our AI understands
                  your business and finds relevant tenders instantly.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-text text-lg mb-2">
                  Increase win rate by 300%
                </div>
                <div className="text-text-light">
                  AI-powered win probability analysis helps you focus on
                  contracts you can actually win.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-text text-lg mb-2">
                  Never miss a deadline
                </div>
                <div className="text-text-light">
                  Smart alerts and real-time monitoring ensure you're always
                  first to know about new opportunities.
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-background rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-success rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-accent rounded-full border-2 border-white"></div>
              </div>
              <div className="text-sm text-text-light">
                <span className="font-semibold text-text">
                  5,000+ businesses
                </span>{" "}
                already winning with MapleBids
              </div>
            </div>
            <div className="text-sm text-text-light italic">
              "We closed $2.3M in contracts in our first 6 months. Best
              investment we've made."
            </div>
            <div className="text-xs text-text-light mt-2">
              — Sarah Chen, TechFlow Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            <div className="mb-4">
              <LogoTitle size="text-3xl" />
            </div>{" "}
            <h1 className="text-2xl font-bold text-text mb-2">
              Start winning today
            </h1>
            <p className="text-text-light">
              Create your account and discover contracts worth millions
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mb-8 text-xs text-text-light">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              Cancel anytime
            </span>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none bg-surface text-text placeholder-text-light pr-12 ${
                    formData.confirmPassword && !isPasswordMatch
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light hover:text-text"
                >
                  {showConfirmPassword ? (
                    <EyeSlash className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && !isPasswordMatch && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords don't match
                </p>
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
              <label htmlFor="terms" className="text-sm text-text-light">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary hover:text-primary-dark"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-primary hover:text-primary-dark"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isAuthLoading}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Creating your account...
                </>
              ) : (
                <>
                  <Lightning className="w-4 h-4" />
                  Start my free trial
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-light">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Additional Trust Signals */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-6 text-xs text-text-light">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                5,000+ Users
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
