import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeSlash,
  Lightning,
  CheckCircle,
  Leaf,
} from "@phosphor-icons/react";
import { signUpUser } from "../api";
import { useAppDispatch } from "../app/hooks";

import {
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSelectors";
import { setAuthLoading, setAuthError } from "../features/auth/authSlice";
import { useSelector } from "react-redux";
import {
  AuthFormLayout,
  AuthBenefitsSection,
  PasswordInput,
  FormInput,
} from "../components";

export default function SignUp() {
  const dispatch = useAppDispatch();
  dispatch(setAuthError(null));
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const signupBenefits = [
    {
      icon: <Lightning className="w-6 h-6 text-success" />,
      title: "Find opportunities 10x faster",
      description:
        "Our AI understands your business and finds relevant Canadian government contracts instantly.",
      iconBg: "bg-success/10",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-primary" />,
      title: "95% time saved on search",
      description:
        "AI-powered matching helps you focus on contracts you can actually win.",
      iconBg: "bg-primary/10",
    },
    {
      icon: <Leaf className="w-6 h-6 text-maple" />,
      title: "Never miss deadlines",
      description:
        "Smart alerts ensure you're always first to know about new opportunities.",
      iconBg: "bg-maple/10",
    },
  ];

  return (
    <AuthFormLayout
      sidebarContent={
        <AuthBenefitsSection
          title="Win more government contracts"
          subtitle="Join 500+ Canadian contractors already using AI to discover and win government tenders."
          benefits={signupBenefits}
        />
      }
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-text mb-2">
          Start winning Canadian contracts
        </h1>
        <p className="text-text-muted">
          Join the leading procurement intelligence platform
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          label="Email address"
          placeholder="you@company.com"
          required
        />

        <PasswordInput
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          required
        />

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
          className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
        >
          {isAuthLoading ? (
            <>
              <Lightning className="w-4 h-4 animate-pulse" />
              Creating your account...
            </>
          ) : (
            <>
              <Leaf className="w-4 h-4" />
              Start discovering contracts
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-text-muted">
          Already winning contracts?{" "}
          <Link
            to="/sign-in"
            className="text-primary hover:opacity-80 font-medium"
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </AuthFormLayout>
  );
}
