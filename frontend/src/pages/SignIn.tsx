import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Lightning } from "@phosphor-icons/react";

import { useSelector } from "react-redux";
import { selectAuthLoading } from "../features/auth/authSelectors";

import { signIn } from "../features/auth/authThunks";
import { useAppDispatch } from "../app/hooks";
import { useSearchParams } from "react-router-dom";
import { selectAuthError } from "../features/auth/authSelectors";
import { setAuthError } from "../features/auth/authSlice";
import {
  AuthFormLayout,
  AuthBenefitsSection,
  PasswordInput,
  FormInput,
} from "../components";

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
    <AuthFormLayout
      sidebarContent={<AuthBenefitsSection />}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-text mb-2">
          Welcome back to Mapletenders
        </h1>
        <p className="text-text-muted">
          Continue discovering Canadian government opportunities
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
        <FormInput
          id="email"
          type="email"
          value={form.email}
          onChange={handleOnChange}
          label="Email address"
          placeholder="your@company.com"
          required
        />

        <PasswordInput
          id="password"
          value={form.password}
          onChange={handleOnChange}
          required
        />

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
          New to government contracts?{" "}
          <Link
            to="/sign-up"
            className="text-primary hover:opacity-80 font-medium"
          >
            Start your 14-day free trial
          </Link>
        </p>
      </div>
    </AuthFormLayout>
  );
}