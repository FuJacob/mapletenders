import React from "react";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function PageHeader({
  icon,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-4xl font-bold text-text mb-4 flex items-center gap-3">
        {icon}
        {title}
      </h1>
      <p className="text-xl text-text-light">{description}</p>
    </div>
  );
}
