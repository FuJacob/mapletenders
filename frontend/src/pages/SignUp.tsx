import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  Lightning,
  CheckCircle,
  Leaf,
  Sparkle,
  Target,
  Star,
  ArrowRight,
  Shield,
  Clock
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

  const benefits = [
    {
      icon: <Lightning className="w-6 h-6 text-primary" />,
      title: "Find opportunities 10x faster",
      description: "Our AI scans all Canadian jurisdictions and finds contracts that match your exact capabilities",
      stat: "2,000+ contracts daily"
    },
    {
      icon: <Target className="w-6 h-6 text-success" />,
      title: "Win rate increased by 300%",
      description: "Smart matching shows you contracts you can actually win, not just random listings",
      stat: "95% relevance score"
    },
    {
      icon: <Shield className="w-6 h-6 text-maple" />,
      title: "Never miss another deadline",
      description: "Get instant alerts when new opportunities match your business profile",
      stat: "Real-time notifications"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-surface-muted flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-success/5 via-primary/5 to-maple/5 items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-success/20 to-primary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-l from-maple/20 to-accent/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-primary/10 to-success/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-lg relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success border border-success/20 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <Clock className="w-4 h-4" />
              Free 14-day trial • No credit card required
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 leading-tight">
              Join 2,000+ Canadian businesses already winning with AI
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-6">
              Stop wasting time searching dozens of government websites. Our AI finds and delivers the perfect contracts directly to you.
            </p>
            
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <div className="text-2xl font-bold text-primary mb-1">$1.2M</div>
                <div className="text-sm text-text-muted">Avg. contracts found per user</div>
              </div>
              <div className="bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                <div className="text-2xl font-bold text-success mb-1">30 days</div>
                <div className="text-sm text-text-muted">Avg. time to first win</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-surface/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-surface/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-text mb-1 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </div>
                  <div className="text-sm text-text-muted leading-relaxed mb-2">
                    {benefit.description}
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {benefit.stat}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-success/10 border border-primary/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-current" />
                ))}
              </div>
              <span className="text-sm text-text font-medium">4.9/5 rating</span>
            </div>
            <div className="text-text-muted text-sm italic mb-2">
              "We won our first $500K contract within 30 days of signing up. The AI matching is incredible."
            </div>
            <div className="text-xs text-text-muted font-medium">
              — Sarah Chen, CEO at BuildTech Solutions
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-maple/10 to-maple/5 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              <Sparkle className="w-3 h-3 animate-pulse" />
              The #1 Procurement Portal for Canadian Businesses
            </div>
            
            <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
              <LogoTitle />
            </Link>

            <h1 className="text-2xl font-bold text-text mb-2">
              Start winning contracts today
            </h1>
            <p className="text-text-muted">
              Join thousands of Canadian businesses discovering opportunities with AI
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
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
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error">
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
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
                I agree to Mapletenders{" "}
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
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Creating your account...
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4" />
                  Start Your Free Trial
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-primary hover:opacity-80 font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
