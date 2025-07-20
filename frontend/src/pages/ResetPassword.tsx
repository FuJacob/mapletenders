import { useState } from "react";
import { Link } from "react-router-dom";
import { Lightning, ArrowLeft } from "@phosphor-icons/react";
import { resetPassword } from "../api/auth";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await resetPassword(email);
      if (response.error) {
        setError(response.error);
      } else {
        setSent(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
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
              Reset your password
            </h1>
            <p className="text-text-light">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
          {sent ? (
            <div className="p-4 bg-success/10 border border-success rounded-lg text-success text-center">
              Check your email for a password reset link.
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
                  htmlFor="email"
                  className="block text-sm font-medium text-text mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@company.com"
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Lightning className="w-4 h-4" />
                    Send reset link
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
