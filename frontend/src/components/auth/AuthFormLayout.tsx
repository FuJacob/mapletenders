import { Link } from "react-router-dom";
import { ArrowLeft, Leaf } from "@phosphor-icons/react";
import { LogoTitle } from "../ui/LogoTitle";

interface AuthFormLayoutProps {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
}

export default function AuthFormLayout({
  children,
  sidebarContent,
  showBackButton = true,
  backTo = "/",
}: AuthFormLayoutProps) {
  return (
    <div className="min-h-screen bg-bg flex relative overflow-hidden">

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          {showBackButton && (
            <div className="flex justify-start">
              <Link
                to={backTo}
                className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>
          )}

          {/* Canadian Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-maple/10 text-maple border border-maple/20 rounded-full text-sm font-medium mb-4">
              <Leaf className="w-3 h-3" />
              Trusted by 500+ Canadian businesses
            </div>
          </div>

          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <LogoTitle />
            </Link>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Benefits/Content */}
      {sidebarContent}
    </div>
  );
}