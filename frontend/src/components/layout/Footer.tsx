import { EnvelopeSimple, MapPin } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface min-h-[67vh]">
      <div className="max-w-7xl mx-auto px-6 h-full">
        {/* Main Footer Content - Large Layout */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-4 gap-16 min-h-[55vh]">
          {/* Column 1: Brand & Description - Expanded */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <LogoTitle size="text-2xl" />
              </div>
              <h2 className="text-4xl font-light mb-6 text-text leading-tight">
                AI-powered procurement
                <br />
                <span className="text-primary font-bold">
                  intelligence platform
                </span>
              </h2>
              <p className="text-lg text-text-light mb-8 max-w-lg leading-relaxed">
                Transform how your business discovers government opportunities
                with enterprise-grade AI that understands your capabilities and
                delivers precision-matched contracts.
              </p>

              {/* CTA Section */}
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4 text-text">
                  Ready to get started?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/sign-up"
                    className="px-8 py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors text-center"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    to="/contact"
                    className="px-8 py-4 border border-border text-text rounded-xl font-medium hover:bg-background transition-colors text-center"
                  >
                    Book Demo
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Media - Bottom of left section */}
            <div>
              <h4 className="text-sm font-semibold mb-4 text-text uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-3 bg-background border border-border rounded-lg text-primary hover:text-primary-dark hover:bg-primary/5 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-3 bg-background border border-border rounded-lg text-primary hover:text-primary-dark hover:bg-primary/5 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-3 bg-background border border-border rounded-lg text-primary hover:text-primary-dark hover:bg-primary/5 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-text">Platform</h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link
                  to="/home"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/table-view"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  Browse Tenders
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  AI Search
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/alerts"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  Smart Alerts
                </Link>
              </li>
              <li>
                <Link
                  to="/pipeline"
                  className="text-text-light hover:text-primary transition-colors flex items-center gap-2 py-1"
                >
                  Pipeline
                </Link>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-6 mt-12 text-text">
              Resources
            </h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link
                  to="/help"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/api-docs"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  User Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-text">Company</h3>
            <ul className="space-y-4 text-base mb-12">
              <li>
                <Link
                  to="/about"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  News & Updates
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-text-light hover:text-primary transition-colors py-1 block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>

            <div className="bg-background border border-border rounded-2xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-text">
                Get in Touch
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <EnvelopeSimple className="w-5 h-5 text-primary flex-shrink-0" />
                  <a
                    href="mailto:info@procuroo.com"
                    className="text-text-light hover:text-primary transition-colors"
                  >
                    info@mapletenders.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-text-light">Toronto, Canada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="py-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-text-light">
            © {currentYear} MapleTenders. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              to="/privacy"
              className="text-text-light hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-text-light hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/accessibility"
              className="text-text-light hover:text-primary transition-colors"
            >
              Accessibility
            </Link>
            <Link
              to="/cookies"
              className="text-text-light hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
