
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { requestLiveDemo } from "../../api/request";

export default function FinalCTASection() {
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
    <section className="py-12 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
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
                  className={`w-full px-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    submitted ? "cursor-not-allowed opacity-60" : ""
                  }`}
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 sm:px-8 py-2 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
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
          </div>
        </div>
      </div>
    </section>
  );
}
