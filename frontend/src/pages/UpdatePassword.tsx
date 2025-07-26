import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lightning, ArrowLeft } from "@phosphor-icons/react";
import { updatePassword } from "../api/auth";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Extract access token from URL parameters (Supabase redirects with these)
    const token =
      searchParams.get("access_token") ||
      window.location.hash.match(/access_token=([^&]+)/)?.[1];
    if (token) {
      setAccessToken(token);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!accessToken) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await updatePassword(password, accessToken);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/sign-in"), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8 flex justify-center items-center flex-col">
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 text-sm text-text-light hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
            <div className="mb-4">
              <LogoTitle size="text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-text mb-2">
              Set a new password
            </h1>
            <p className="text-text-light">Enter your new password below.</p>
          </div>
          {success ? (
            <div className="p-4 bg-success/10 border border-success rounded-lg text-success text-center">
              Password updated! Redirecting to sign in...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text mb-2"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Confirm new password
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Lightning className="w-4 h-4 animate-pulse" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lightning className="w-4 h-4" />
                    Update password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
