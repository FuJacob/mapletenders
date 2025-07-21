import { useNavigate } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-primary">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-6xl font-semibold text-white mb-6">
            Ready to see <span>MapleTenders in action?</span>
          </h2>
        </div>

        {/* Right side - Form box */}
        <div className="flex-1 w-full max-w-md">
          <div className="bg-surface rounded-2xl p-8">
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                Request Live Demo
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/sign-up")}
                className="text-primary hover:text-primary-dark font-medium transition-colors"
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
