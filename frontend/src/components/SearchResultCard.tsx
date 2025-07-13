import { Link } from "react-router-dom";
import {
  Bookmark,
  Building,
  Calendar,
  Clock,
  MapPin,
  Sparkle,
  ArrowSquareOut,
  ChartBar,
} from "@phosphor-icons/react";
import type { TenderSearchResult } from "../api/types";

interface SearchResultCardProps {
  result: TenderSearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  function formatDate(dateString: string | null): string {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getMatchScore(result: TenderSearchResult): number {
    return result.search_score ? Math.min(result.search_score * 10, 100) : 85;
  }

  function getScoreColor(score: number): string {
    if (score >= 90) return "bg-success/10 text-success border-success/20";
    if (score >= 75) return "bg-warning/10 text-warning border-warning/20";
    return "bg-text-muted/10 text-text-muted border-text-muted/20";
  }

  const matchScore = getMatchScore(result);
  const scoreColorClass = getScoreColor(matchScore);

  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-200">
      {/* Header with Title and Actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <Link
            to={`/tender-notice/${result.id}`}
            className="group flex items-center gap-2 mb-3"
          >
            <h3 className="text-xl font-semibold text-primary hover:text-primary/80 cursor-pointer transition-colors line-clamp-2 flex-1">
              {result.title}
            </h3>
            <ArrowSquareOut className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors flex-shrink-0" />
          </Link>

          {/* Match Score and Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium border ${scoreColorClass}`}
            >
              <ChartBar className="w-3 h-3 inline mr-1" />
              {matchScore.toFixed(0)}% match
            </span>
            {result.notice_type && (
              <span className="text-xs bg-surface-muted text-text px-3 py-1 rounded-full font-medium">
                {result.notice_type}
              </span>
            )}
            {result.procurement_method && (
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {result.procurement_method}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-6 text-sm text-text-muted mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4" />
          <span>{result.contracting_entity_name || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>
            {result.contracting_entity_city || "N/A"},{" "}
            {result.contracting_entity_province || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Closes: {formatDate(result.tender_closing_date)}</span>
        </div>
      </div>

      {/* AI Match Explanation */}
      {result.match_explanation && (
        <div className="bg-secondary border border-primary/20 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-text">
              AI Analysis: Why this matches your search
            </span>
          </div>
          <p className="text-sm text-text-muted">{result.match_explanation}</p>
        </div>
      )}

      {/* Description */}
      {result.tender_description && (
        <p className="text-text-muted mb-4 line-clamp-3">
          {result.tender_description}
        </p>
      )}

      {/* Category Tags */}
      <div className="flex items-center gap-2 mb-4">
        {[result.procurement_category, result.gsin_description]
          .filter(Boolean)
          .slice(0, 3)
          .map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-surface-muted text-text-muted px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Calendar className="w-4 h-4" />
          <span>Deadline: {formatDate(result.tender_closing_date)}</span>
        </div>

        <div className="text-sm text-text-muted">
          ID: {result.reference_number || result.id}
        </div>
      </div>
    </div>
  );
}
