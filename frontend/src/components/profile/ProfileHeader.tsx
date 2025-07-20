import { PencilSimple } from "@phosphor-icons/react";
import { industries, type IndustryOption } from "./profileConstants";

interface ProfileHeaderProps {
  profile: any;
  isEditing: boolean;
  onEditClick: () => void;
}

export default function ProfileHeader({ profile, isEditing, onEditClick }: ProfileHeaderProps) {
  const getIndustryDisplay = (value: string) => {
    const industry = industries.find((i: IndustryOption) => i.value === value);
    return industry ? industry.label : "Unknown Industry";
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {profile?.company_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text">
            {profile?.company_name || "Your Company"}
          </h1>
          <p className="text-text-light">
            {profile?.industry
              ? getIndustryDisplay(profile.industry)
              : "Company Profile"}
          </p>
        </div>
      </div>

      {!isEditing && (
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <PencilSimple className="w-4 h-4" />
          Edit Profile
        </button>
      )}
    </div>
  );
}