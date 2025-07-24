import { Calendar } from "@phosphor-icons/react";

interface WelcomeSectionProps {
  companyName?: string;
  userName?: string;
}

export default function WelcomeSection({ 
  companyName = "Your Company", 
  userName = "there" 
}: WelcomeSectionProps) {
  const currentDate = new Date();
  const timeOfDay = currentDate.getHours() < 12 ? "morning" : currentDate.getHours() < 18 ? "afternoon" : "evening";
  
  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Good {timeOfDay}, {userName}! 👋
          </h1>
          <p className="text-text-muted text-sm sm:text-base">
            Welcome back to <span className="font-semibold text-text">{companyName}</span>'s procurement intelligence dashboard.
            Stay on top of Canadian government opportunities and never miss a deadline.
          </p>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-text-light">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </span>
        </div>
      </div>
    </div>
  );
}