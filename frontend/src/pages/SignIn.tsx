import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Lightning, Eye, EyeSlash, Leaf, Sparkle, TrendUp, Target, Star, ArrowRight } from "@phosphor-icons/react";

import { useSelector } from "react-redux";
import { selectAuthLoading } from "../features/auth/authSelectors";

import { signIn } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { selectAuthError } from "../features/auth/authSelectors";
import { setAuthError } from "../features/auth/authSlice";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SignIn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [needToConfirmEmail] = useState(
    searchParams.get("confirm-email") === "true"
  );
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
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

  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-success" />,
      title: "$1.2M in contracts discovered",
      description: "Average value of opportunities found per user in their first year"
    },
    {
      icon: <TrendUp className="w-6 h-6 text-primary" />,
      title: "95% time saved on search",
      description: "Focus on winnable contracts instead of endless browsing"
    },
    {
      icon: <Lightning className="w-6 h-6 text-maple" />,
      title: "Real-time alerts",
      description: "Never miss another deadline with smart notifications"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-surface-muted flex">
      {/* Left Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/5 via-maple/5 to-success/5 items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-l from-success/20 to-maple/20 rounded-full blur-2xl" />
        </div>

        <div className="max-w-lg relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-warning fill-current" />
                ))}
              </div>
              <span className="text-sm text-text-muted font-medium">
                4.9/5 from 2,000+ businesses
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-text mb-4 leading-tight">
              Welcome back to Canada's #1 procurement platform
            </h2>
            <p className="text-lg text-text-muted leading-relaxed">
              Join thousands of Canadian businesses already winning government contracts with AI-powered discovery.
            </p>
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
                  <div className="text-sm text-text-muted leading-relaxed">
                    {benefit.description}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-surface/30 backdrop-blur-sm border border-border/50 rounded-2xl">
            <div className="text-text-muted text-sm italic mb-2">
              "Mapletenders helped us discover and win our first $500K government contract within 30 days."
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
              Trusted by 2,000+ Canadian businesses
            </div>
            
            <Link to="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
              <LogoTitle />
            </Link>

            <h1 className="text-2xl font-bold text-text mb-2">
              Welcome back
            </h1>
            <p className="text-text-muted">
              Continue discovering opportunities that match your business
            </p>
          </div>

          {/* Success Message */}
          {needToConfirmEmail && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-medium text-success">
                  Account created successfully!
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                Please check your inbox and click the confirmation link to activate your account.
              </p>
            </div>
          )}

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
                type="email"
                value={form.email}
                onChange={handleOnChange}
                placeholder="your@company.com"
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
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleOnChange}
                  placeholder="Enter your password"
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
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-primary border-border rounded focus:ring-primary" />
                <span className="text-sm text-text-muted">Remember me</span>
              </label>
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
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {isAuthLoading ? (
                <>
                  <Lightning className="w-4 h-4 animate-pulse" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-text-muted">
              New to government contracts?{" "}
              <Link
                to="/sign-up"
                className="text-primary hover:opacity-80 font-semibold"
              >
                Start your 14-day free trial
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}