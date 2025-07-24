import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Building,
  Clock,
  MapPin,
  ArrowSquareOut,
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
  const matchExplanation = TenderAccessors.getMatchExplanation(tender);

  // Compact mode - for recommended tenders
  if (compact) {
    return (
      <div
        className={`bg-surface border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group ${className}`}
      >
        {/* Compact Header */}
        <div className="flex items-start gap-3 mb-3">
          {/* Compact Match Score */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold text-xs ${scoreColorClass} flex-shrink-0`}
          >
            {getScoreIcon(matchScore)}
            <span>{matchScore.toFixed(0)}%</span>
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <button onClick={handleTitleClick} className="group/link block">
              <h3 className="text-base font-bold text-text group-hover/link:text-primary cursor-pointer transition-colors line-clamp-2 leading-tight">
                {TenderAccessors.getTitle(tender)}
              </h3>
            </button>
          </div>

          {/* Bookmark */}
          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(TenderAccessors.getId(tender))}
              className={`p-1.5 rounded-md transition-all duration-200 flex-shrink-0 ${
                isBookmarked
                  ? "text-primary bg-primary/10 hover:bg-primary/20"
                  : "text-text-muted hover:text-primary hover:bg-primary/10"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Compact Info Row */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Building className="w-3 h-3" />
              <span className="truncate max-w-[120px]">
                {entityName || "Unknown"}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {entityProvince || deliveryLocation || "Canada"}
            </span>
          </div>
          <div
            className={`flex items-center gap-1 font-medium ${urgencyClass}`}
          >
            <Clock className="w-3 h-3" />
            {daysUntilDeadline !== null &&
            daysUntilDeadline <= 14 &&
            daysUntilDeadline >= 0
              ? `${daysUntilDeadline}d left`
              : formatDate(TenderAccessors.getClosingDate(tender))}
          </div>
        </div>

        {/* Description Section with Expand/Collapse */}
        {description && (
          <div className="mb-4">
            <div
              className={`text-sm text-text-muted leading-relaxed ${
                isDescriptionExpanded ? "" : "line-clamp-2"
              }`}
            >
              {description}
            </div>
            {description.length > 150 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {isDescriptionExpanded ? (
                  <>
                    <CaretUp className="w-3 h-3" />
                    Show less
                  </>
                ) : (
                  <>
                    <CaretDown className="w-3 h-3" />
                    Show more
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Compact Tags */}
        <div className="flex items-center gap-1.5 mt-2">
          {procurementMethod && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {procurementMethod}
            </span>
          )}
          {TenderAccessors.getProcurementType(tender) && (
            <span className="text-xs bg-surface-muted text-text-muted px-2 py-0.5 rounded-full">
              {TenderAccessors.getProcurementType(tender)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Normal mode - full information layout
  return (
    <div
      className={`bg-surface border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 group ${className}`}
    >
      {/* Header Row: Match Score + Title + Action */}
      <div className="flex items-start gap-4 mb-4">
        {/* Match Score Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm ${scoreColorClass} flex-shrink-0`}
        >
          {getScoreIcon(matchScore)}
          <span>{matchScore.toFixed(0)}%</span>
        </div>

        {/* Title and Canadian Badge */}
        <div className="flex-1 min-w-0">
          <button onClick={handleTitleClick} className="group/link block">
            <h3 className="text-xl font-bold text-text group-hover/link:text-primary cursor-pointer transition-colors line-clamp-2 mb-1 leading-tight">
              {TenderAccessors.getTitle(tender)}
            </h3>
          </button>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Leaf className="w-4 h-4 text-maple" />
            <span>Canadian Government Opportunity</span>
            <ArrowSquareOut className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Bookmark Action */}
        {onBookmarkToggle && (
          <button
            onClick={() => onBookmarkToggle(TenderAccessors.getId(tender))}
            className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              isBookmarked
                ? "text-primary bg-primary/10 hover:bg-primary/20"
                : "text-text-muted bg-surface-muted/30 hover:text-primary hover:bg-primary/10"
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Critical Business Information Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 p-4 bg-surface-muted/30 rounded-lg">
        {/* Government Entity */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Entity
            </div>
            <div
              className="font-semibold text-text truncate"
              title={entityName || "Unknown"}
            >
              {entityName || "Unknown Entity"}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-maple/10 rounded-lg">
            <MapPin className="w-5 h-5 text-maple" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Location
            </div>
            <div className="font-semibold text-text truncate">
              {entityCity || deliveryLocation || "Unknown"},{" "}
              {entityProvince || "Canada"}
            </div>
          </div>
        </div>

        {/* Deadline with Urgency */}
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              daysUntilDeadline !== null && daysUntilDeadline <= 14
                ? "bg-error/10"
                : "bg-accent/10"
            }`}
          >
            <Clock
              className={`w-5 h-5 ${
                daysUntilDeadline !== null && daysUntilDeadline <= 14
                  ? "text-error"
                  : "text-accent"
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Deadline
            </div>
            <div className={`font-bold ${urgencyClass}`}>
              {formatDate(TenderAccessors.getClosingDate(tender))}
              {daysUntilDeadline !== null && (
                <span className="ml-2 text-xs">
                  (
                  {daysUntilDeadline < 0
                    ? "Expired"
                    : daysUntilDeadline === 0
                    ? "Today"
                    : `${daysUntilDeadline}d left`}
                  )
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Match Analysis - Only for search results */}
      {matchExplanation && (
        <div className="mb-4 p-3 bg-surface-muted rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Lightning className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-text">
              AI Match Analysis
            </span>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            {matchExplanation}
          </p>
        </div>
      )}

      {/* Description Section with Expand/Collapse */}
      {description && (
        <div className="mb-4">
          <div
            className={`text-sm text-text-muted leading-relaxed ${
              isDescriptionExpanded ? "" : "line-clamp-2"
            }`}
          >
            {description}
          </div>
          {description.length > 150 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
            >
              {isDescriptionExpanded ? (
                <>
                  <CaretUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <CaretDown className="w-3 h-3" />
                  Show more
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Secondary Information Row */}
      <div className="flex items-center justify-between">
        {/* Procurement Details */}
        <div className="flex items-center gap-3">
          {procurementMethod && (
            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">
              {procurementMethod}
            </span>
          )}
          {TenderAccessors.getProcurementType(tender) && (
            <span className="text-xs bg-surface-muted text-text-muted px-3 py-1 rounded-full font-medium">
              {TenderAccessors.getProcurementType(tender)}
            </span>
          )}
          {TenderAccessors.getCategoryPrimary(tender) && (
            <span className="text-xs bg-surface-muted text-text-muted px-3 py-1 rounded-full font-medium">
              {TenderAccessors.getCategoryPrimary(tender)!.length > 20
                ? `${TenderAccessors.getCategoryPrimary(tender)!.substring(
                    0,
                    20
                  )}...`
                : TenderAccessors.getCategoryPrimary(tender)}
            </span>
          )}
        </div>

        {/* Full Reference ID - No truncation */}
        <div className="text-xs text-text-muted font-mono">
          {sourceReference || TenderAccessors.getId(tender) || "No ID"}
        </div>
      </div>
    </div>
  );
}
