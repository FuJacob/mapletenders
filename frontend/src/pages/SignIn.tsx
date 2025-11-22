import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Lightning,
  Eye,
  EyeSlash,
  Leaf,
  Sparkle,
} from "@phosphor-icons/react";

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

          <h1 className="text-2xl font-bold text-text mb-2">Welcome back</h1>
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
              Please check your inbox and click the confirmation link to
              activate your account.
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
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
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
              Start your 7-day free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
