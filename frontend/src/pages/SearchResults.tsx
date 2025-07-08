import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  MagnifyingGlass,
  Funnel,
  Bookmark,
  Eye,
  Calendar,
  MapPin,
  CurrencyDollar,
  Sparkle,
  ArrowLeft,
  Building,
  Clock,
} from "@phosphor-icons/react";
import { filterByVector } from "../api";
import { type Tender } from "../features/tenders/types";
import { LogoTitle } from "../components/ui/LogoTitle";

export default function SearchResults() {
  const [searchParms, _setSearchParms] = useSearchParams();
  const [firstQuery, _setFirstQuery] = useState(searchParms.get("q") || "");
  const [query, setQuery] = useState(searchParms.get("q") || "");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState<
    (Tender & { similarity: number })[]
  >([]);

  useEffect(() => {
    const getFilteredTenders = async (q: string) => {
      if (!q) return [];
      try {
        const results = await filterByVector(q);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching filtered tenders:", error);
        return [];
      }
    };
    getFilteredTenders(firstQuery);
  }, [firstQuery, query]);

  const filters = [
    {
      label: "Budget Range",
      options: ["Under $50K", "$50K-$100K", "$100K-$200K", "Over $200K"],
    },
    {
      label: "Location",
      options: [
        "Ontario",
        "British Columbia",
        "Alberta",
        "Quebec",
        "All Provinces",
      ],
    },
    { label: "Type", options: ["RFP", "RFQ", "ITQ", "Standing Offer"] },
    {
      label: "Closing Date",
      options: ["This Week", "This Month", "Next 3 Months", "All"],
    },
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <div className=" mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/"
              className="p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <LogoTitle size="text-2xl" />
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-light" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-0 focus:outline-none bg-background"
              placeholder="Search for government contracts..."
            />
          </div>
        </div>
      </div>

      <div className=" mx-auto p-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-64 flex-shrink-0`}
          >
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Filters</h3>

              {filters.map((filter, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-sm font-medium text-text mb-2">
                    {filter.label}
                  </h4>
                  <div className="space-y-2">
                    {filter.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-border"
                        />
                        <span className="text-text-light">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-text mb-2">
                  Search Results for "{firstQuery}"
                </h1>
                <p className="text-text-light">
                  Found {searchResults.length} relevant contracts • Sorted by
                  relevance
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors"
                >
                  <Funnel className="w-4 h-4" />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border rounded-lg px-4 py-2 bg-background focus:border-primary focus:outline-none"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="deadline">Sort by Deadline</option>
                  <option value="value">Sort by Value</option>
                  <option value="date">Sort by Date Posted</option>
                </select>
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-6">
              {searchResults.map((result) => {
                const tags = [
                  result.procurement_method,
                  result.procurement_category,
                  result.notice_type,
                ].filter(Boolean);
                return (
                  <div
                    key={result.id}
                    className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Result Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link
                            to={`/tender-notice/${result.id}`}
                            className="text-xl font-semibold text-text hover:text-primary cursor-pointer transition-colors"
                          >
                            {result.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              {(result.similarity * 100).toFixed(0)}% match
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              {result.notice_type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-text-light mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {result.contracting_entity_city || "N/A"},{" "}
                            {result.contracting_entity_province || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <CurrencyDollar className="w-4 h-4" />
                            N/A
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {result.contracting_entity_city || "N/A"},{" "}
                            {result.contracting_entity_province || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(result.tender_closing_date)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button className="p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors">
                          <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* AI Match Explanation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Why this matches:
                        </span>
                      </div>
                      <p className="text-sm text-blue-700">
                        {result.procurement_category || "AI relevance match"}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-text-light mb-4">
                      {result.tender_description}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1 text-sm text-text-light">
                        <Calendar className="w-4 h-4" />
                        Deadline: {formatDate(result.tender_closing_date)}
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/tender-notice/${result.id}`}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/tender-notice/${result.id}`}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          View Tender
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-surface border border-border text-text px-6 py-3 rounded-lg hover:bg-border transition-colors">
                Load More Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
