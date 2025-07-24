import { Link } from "react-router-dom";
import { Leaf, Sparkle } from "@phosphor-icons/react";
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
}: AuthFormLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg to-surface flex relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-maple/5 to-success/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-primary/3 to-accent/3 rounded-full blur-3xl" />
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Animated Canadian Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-maple/10 to-maple/5 text-maple border border-maple/20 rounded-full text-sm font-medium mb-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <Leaf className="w-4 h-4" />
              <Sparkle className="w-3 h-3 animate-pulse" />
              Trusted by 500+ Canadian businesses
            </div>
          </div>

          {/* Logo with subtle animation */}
          <div className="text-center">
            <Link to="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
              <LogoTitle />
            </Link>
          </div>

          {/* Form Content */}
          <div className="bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
            {children}
          </div>
        </div>
      </div>

      {/* Right Side - Benefits/Content */}
      {sidebarContent}
    </div>
  );
}
