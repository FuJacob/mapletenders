import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { requestLiveDemo } from "../../api/request";

export default function FinalCTASection() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || submitted) {
      return;
    }
    try {
      const response = await requestLiveDemo(email);
      if (response.message) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to request live demo");
      }
    } catch (error) {
      console.error(error);
      setSubmitted(false);
    }
  };
  return (
    <section className="py-24 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-6">
            Ready to see <span>MapleTenders in action?</span>
          </h2>
        </div>

        {/* Right side - Form box */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-surface rounded-lg p-6 sm:p-8">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  disabled={submitted}
                  type="email"
                  id="email"
                  name="email"
                  placeholder={
                    submitted ? "We'll be in touch soon." : "Enter your email"
                  }
                  className={`w-full px-4 py-3 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    submitted ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-medium text-sm sm:text-base rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="text-xs sm:text-sm">
                      Thank you, we'll be in touch soon.
                    </span>
                  </>
                ) : (
                  <>
                    Request Live Demo
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
                  </>
                )}
              </button>
            </form>
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={() => navigate("/sign-up")}
                className="text-sm sm:text-base text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Or start your free trial →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
