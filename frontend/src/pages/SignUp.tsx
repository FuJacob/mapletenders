import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeSlash, Lightning, Leaf } from "@phosphor-icons/react";
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
    <div className="flex items-center justify-center py-4 px-8 min-h-screen">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block mb-8 hover:opacity-80 transition-opacity"
          >
            <LogoTitle />
          </Link>

          <h1 className="text-2xl font-bold text-text mb-2">
            Start winning contracts today
          </h1>
          <p className="text-text-muted">
            Join thousands of Canadian businesses discovering opportunities with
            AI
          </p>
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
  );
}
