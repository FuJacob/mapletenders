import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Building,
  Clock,
  MapPin,
  Trophy,
  Star,
  Leaf,
  Lightning,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import type { TenderDisplayData } from "../../types/tender";
import { TenderAccessors } from "../../types/tender";

interface TenderCardProps {
  tender: TenderDisplayData;
  compact?: boolean;
  onBookmarkToggle?: (tenderId: string) => void;
  className?: string;
  setSelectedTender?: (tenderId: string) => void;
}

export function TenderCard({
  tender,
  compact = false,
  onBookmarkToggle,
  className = "",
  setSelectedTender,
}: TenderCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const navigate = useNavigate();
  function formatDate(dateString: string | null): string {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getMatchScore(tender: TenderDisplayData): number {
    const searchScore = TenderAccessors.getSearchScore(tender);
    if (searchScore !== null) {
      return Math.min(searchScore * 10, 100);
    }

    const relevanceScore = TenderAccessors.getRelevanceScore(tender);
    if (relevanceScore !== null) {
      return relevanceScore;
    }

    return 85; // Default relevance
  }

  function getScoreColorClass(score: number): string {
    if (score >= 90) return "bg-primary text-white";
    if (score >= 75) return "bg-maple text-white";
    return "bg-text-muted text-white";
  }

  function getScoreIcon(score: number) {
    if (score >= 90) return <Trophy className="w-4 h-4" />;
    if (score >= 75) return <Star className="w-4 h-4" />;
    return <Lightning className="w-4 h-4" />;
  }

  function getDaysUntilDeadline(dateString: string | null): number | null {
    if (!dateString) return null;
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getUrgencyClass(days: number | null): string {
    if (days === null) return "text-text-muted";
    if (days < 0) return "text-error"; // Expired
    if (days <= 7) return "text-error"; // Very urgent
    if (days <= 14) return "text-warning"; // Urgent
    return "text-text-muted"; // Normal
  }

  function handleTitleClick() {
    if (setSelectedTender) {
      setSelectedTender(TenderAccessors.getId(tender));
    } else {
      navigate(`/tender-notice/${TenderAccessors.getId(tender)}`);
    }
  }

  // Extract data using type-safe accessors
  const matchScore = getMatchScore(tender);
  const scoreColorClass = getScoreColorClass(matchScore);
  const daysUntilDeadline = getDaysUntilDeadline(
    TenderAccessors.getClosingDate(tender)
  );
  const urgencyClass = getUrgencyClass(daysUntilDeadline);
  const isBookmarked = TenderAccessors.getIsBookmarked(tender);
  const entityName = TenderAccessors.getContractingEntityName(tender);
  const entityCity = TenderAccessors.getContractingEntityCity(tender);
  const entityProvince = TenderAccessors.getContractingEntityProvince(tender);
  const deliveryLocation = TenderAccessors.getDeliveryLocation(tender);
  const procurementMethod = TenderAccessors.getProcurementMethod(tender);
  const description = TenderAccessors.getDescription(tender);
  const sourceReference = TenderAccessors.getSourceReference(tender);
  // const _matchExplanation = TenderAccessors.getMatchExplanation(tender);

  // Compact mode - Apple-inspired minimal design for smaller contexts
  if (compact) {
    return (
      <div
        className={`bg-surface border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group ${className}`}
      >
        {/* Header - Match Score + Title */}
        <div className="flex items-start gap-3 mb-4">
          {/* Refined Match Score */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-xs ${scoreColorClass} shadow-sm flex-shrink-0`}
          >
            {getScoreIcon(matchScore)}
            <span>{matchScore.toFixed(0)}%</span>
          </div>

          {/* Title with Clean Typography */}
          <div className="flex-1 min-w-0 pr-2">
            <h3
              className="text-lg font-bold text-text hover:text-primary cursor-pointer transition-colors line-clamp-2 leading-tight"
              onClick={handleTitleClick}
            >
              {TenderAccessors.getTitle(tender)}
            </h3>
          </div>

          {/* Minimal Bookmark */}
          {onBookmarkToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmarkToggle(TenderAccessors.getId(tender));
              }}
              className={`p-2 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                isBookmarked
                  ? "text-primary bg-primary/10 shadow-sm"
                  : "text-text-light hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Essential Information - Streamlined */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <Building className="w-3.5 h-3.5 text-text-light flex-shrink-0" />
              <span className="truncate font-medium text-text max-w-[120px]">
                {entityName || "Government Entity"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-text-light flex-shrink-0" />
              <span className="font-medium text-text">
                {entityProvince || deliveryLocation || "Canada"}
              </span>
            </div>
          </div>

          {/* Deadline - Clean and Urgent When Needed */}
          <div
            className={`flex items-center gap-1.5 font-bold text-xs ${urgencyClass} flex-shrink-0`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {daysUntilDeadline !== null &&
              daysUntilDeadline <= 14 &&
              daysUntilDeadline >= 0
                ? daysUntilDeadline === 0
                  ? "Today"
                  : `${daysUntilDeadline}d left`
                : formatDate(TenderAccessors.getClosingDate(tender))}
            </span>
          </div>
        </div>

        {/* Description - Minimal but Readable */}
        {description && (
          <div className="mb-4">
            <div
              className={`text-sm text-text-muted leading-relaxed ${
                isDescriptionExpanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </div>
            {description.length > 120 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescriptionExpanded(!isDescriptionExpanded);
                }}
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {isDescriptionExpanded ? (
                  <>
                    <CaretUp className="w-3 h-3" />
                    Less
                  </>
                ) : (
                  <>
                    <CaretDown className="w-3 h-3" />
                    More
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Footer - Minimal Tags */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            {procurementMethod && (
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                {procurementMethod}
              </span>
            )}
            {TenderAccessors.getProcurementType(tender) && (
              <span className="text-xs bg-surface-muted text-text-muted px-2.5 py-1 rounded-full font-medium">
                {TenderAccessors.getProcurementType(tender)}
              </span>
            )}
          </div>

          <div className="text-xs text-text-light font-mono">
            {sourceReference?.slice(-6) ||
              TenderAccessors.getId(tender)?.slice(-6) ||
              "N/A"}
          </div>
        </div>
      </div>
    );
  }

  // Normal mode - Apple-inspired clean layout
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group ${className}`}
    >
      {/* Header - Clean and Spacious */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 min-w-0 pr-6">
          {/* Match Score - Subtle and Elegant */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm ${scoreColorClass} shadow-sm`}
            >
              {getScoreIcon(matchScore)}
              <span>{matchScore.toFixed(0)}% Match</span>
            </div>
            <div className="text-xs text-text-light tracking-wide">
              AI-Powered Recommendation
            </div>
          </div>

          {/* Title - Hero Typography */}
          <h2
            className="text-2xl font-bold text-text leading-tight mb-3 hover:text-primary cursor-pointer transition-colors"
            onClick={handleTitleClick}
          >
            {TenderAccessors.getTitle(tender)}
          </h2>

          {/* Subtitle - Clean and Minimal */}
          <div className="flex items-center gap-2 text-text-muted">
            <Leaf className="w-4 h-4 text-maple" />
            <span className="text-sm font-medium">
              Canadian Government Opportunity
            </span>
          </div>
        </div>

        {/* Bookmark - Floating Action */}
        {onBookmarkToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(TenderAccessors.getId(tender));
            }}
            className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
              isBookmarked
                ? "text-primary bg-primary/10 shadow-sm"
                : "text-text-light hover:text-primary hover:bg-primary/10"
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Key Information - Clean Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {/* Entity */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-light uppercase tracking-wide">
            Contracting Entity
          </div>
          <div className="font-semibold text-text leading-tight">
            {entityName || "Government Entity"}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-light uppercase tracking-wide">
            Location
          </div>
          <div className="font-semibold text-text leading-tight">
            {entityCity || deliveryLocation || "Unknown"},{" "}
            {entityProvince || "Canada"}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-text-light uppercase tracking-wide">
            Closing Date
          </div>
          <div className={`font-bold leading-tight ${urgencyClass}`}>
            {formatDate(TenderAccessors.getClosingDate(tender))}
            {daysUntilDeadline !== null &&
              daysUntilDeadline >= 0 &&
              daysUntilDeadline <= 14 && (
                <div className="text-xs font-medium mt-1">
                  {daysUntilDeadline === 0
                    ? "Closes Today"
                    : `${daysUntilDeadline} days remaining`}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* AI Match Analysis - When Available
      {matchExplanation && (
        <div className="mb-8 p-6 bg-primary/5 border border-primary/10 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Lightning className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Why This Matches
            </span>
          </div>
          <p className="text-sm text-text leading-relaxed">
            {matchExplanation}
          </p>
        </div>
      )} */}

      {/* Description - Clean Typography */}
      {description && (
        <div className="mb-8">
          <div className="text-xs font-semibold text-text-light uppercase tracking-wide mb-3">
            Project Description
          </div>
          <div
            className={`text-text leading-relaxed ${
              isDescriptionExpanded ? "" : "line-clamp-3"
            }`}
          >
            {description}
          </div>
          {description.length > 200 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDescriptionExpanded(!isDescriptionExpanded);
              }}
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {isDescriptionExpanded ? (
                <>
                  <CaretUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <CaretDown className="w-3 h-3" />
                  Read more
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Footer - Minimal Metadata */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <div className="flex items-center gap-4">
          {procurementMethod && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
              {procurementMethod}
            </span>
          )}
          {TenderAccessors.getProcurementType(tender) && (
            <span className="text-xs bg-surface-muted text-text-muted px-3 py-1.5 rounded-full font-medium">
              {TenderAccessors.getProcurementType(tender)}
            </span>
          )}
        </div>

        <div className="text-xs text-text-light font-mono">
          {sourceReference || TenderAccessors.getId(tender)?.slice(-8) || "N/A"}
        </div>
      </div>
    </div>
  );
}
