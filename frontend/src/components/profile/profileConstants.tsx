import React from "react";
import {
  Building,
  Briefcase,
  Lightning,
  Target,
  Users,
  TrendUp,
  Crown,
  Wrench,
  GraduationCap,
  Heart,
  Car,
  Factory,
} from "@phosphor-icons/react";

export const companySizes = [
  {
    value: "1-10",
    label: "1-10 employees",
    description: "Solo or small team",
  },
  {
    value: "11-50",
    label: "11-50 employees",
    description: "Growing business",
  },
  {
    value: "51-200",
    label: "51-200 employees",
    description: "Medium company",
  },
  {
    value: "201-1000",
    label: "201-1000 employees",
    description: "Large enterprise",
  },
  {
    value: "1000+",
    label: "1000+ employees",
    description: "Major corporation",
  },
];

// Icon component mapping
const iconComponents = {
  Lightning,
  Building,
  Users,
  Briefcase,
  Heart,
  GraduationCap,
  Factory,
  Car,
  Wrench,
  Target,
  TrendUp,
  Crown,
};

export type IconName = keyof typeof iconComponents;

export interface IndustryOption {
  value: string;
  label: string;
  iconName: IconName;
}

export const industries: IndustryOption[] = [
  {
    value: "it-services",
    label: "IT Services",
    iconName: "Lightning",
  },
  {
    value: "construction",
    label: "Construction",
    iconName: "Building",
  },
  {
    value: "consulting",
    label: "Consulting",
    iconName: "Users",
  },
  {
    value: "professional-services",
    label: "Professional Services",
    iconName: "Briefcase",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    iconName: "Heart",
  },
  {
    value: "education",
    label: "Education",
    iconName: "GraduationCap",
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
    iconName: "Factory",
  },
  {
    value: "transportation",
    label: "Transportation",
    iconName: "Car",
  },
  {
    value: "maintenance",
    label: "Maintenance",
    iconName: "Wrench",
  },
  { value: "other", label: "Other", iconName: "Target" },
];

// Helper function to render icons
export const renderIndustryIcon = (iconName: IconName, className: string = "w-5 h-5") => {
  const IconComponent = iconComponents[iconName];
  return React.createElement(IconComponent, { className });
};

export const services = [
  "Software Development",
  "IT Support & Maintenance",
  "Cybersecurity",
  "Data Analytics",
  "Cloud Services",
  "Digital Transformation",
  "Construction",
  "Infrastructure",
  "Architecture & Engineering",
  "Project Management",
  "Business Consulting",
  "HR Services",
  "Legal Services",
  "Financial Services",
  "Marketing & Communications",
  "Training & Education",
  "Research & Development",
  "Equipment Supply",
  "Facility Management",
  "Security Services",
  "Other",
];

export interface ExperienceLevel {
  value: string;
  label: string;
  description: string;
  iconName: IconName;
  colorClass: string;
}

export const experienceLevels: ExperienceLevel[] = [
  {
    value: "none",
    label: "New to government contracts",
    description: "First time bidding on government work",
    iconName: "Target",
    colorClass: "text-accent",
  },
  {
    value: "some",
    label: "Some experience",
    description: "1-5 government contracts completed",
    iconName: "TrendUp",
    colorClass: "text-primary",
  },
  {
    value: "experienced",
    label: "Experienced contractor",
    description: "6+ government contracts completed",
    iconName: "Crown",
    colorClass: "text-success",
  },
  {
    value: "expert",
    label: "Expert contractor",
    description: "Regular government contractor, 50+ contracts",
    iconName: "Lightning",
    colorClass: "text-secondary",
  },
];

// Helper function to render experience level icons
export const renderExperienceIcon = (iconName: IconName, colorClass: string = "", className: string = "w-5 h-5") => {
  const IconComponent = iconComponents[iconName];
  const fullClassName = colorClass ? `${className} ${colorClass}` : className;
  return React.createElement(IconComponent, { className: fullClassName });
};

export const contractSizes = [
  { value: "under-50k", label: "Under $50K", description: "Small projects" },
  {
    value: "50k-250k",
    label: "$50K - $250K",
    description: "Medium projects",
  },
  { value: "250k-1m", label: "$250K - $1M", description: "Large projects" },
  { value: "1m-5m", label: "$1M - $5M", description: "Major contracts" },
  { value: "5m+", label: "$5M+", description: "Enterprise contracts" },
];

export const canadianProvinces = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick", 
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", 
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", 
  "Saskatchewan", "Yukon", "National"
];