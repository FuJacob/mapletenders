import {
  MagnifyingGlass,
  MapPin,
  Buildings,
  Tag,
  FunnelSimple,
  Clock,
  CaretDown,
  X,
} from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import type { Tender } from "../../api/types";

interface QuickFiltersProps {
  setGlobalFilter: (filter: string) => void;
  tenders?: Tender[];
  onFilteredDataChange?: (filteredData: Tender[]) => void;
}

interface FilterOption {
  id: string;
  label: string;
  type: string;
}

const QuickFilters = ({
  setGlobalFilter,
  tenders = [],
  onFilteredDataChange,
}: QuickFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on available data
  const regions = [
    "Ontario",
    "British Columbia",
    "Alberta",
    "Quebec",
    "Manitoba",
    "Saskatchewan",
    "Nova Scotia",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Prince Edward Island",
  ];

  const procurementCategories = [
    "Information Technology",
    "Construction",
    "Professional Services",
    "Medical and Health Services",
    "Engineering Services",
    "Maintenance and Repair",
    "Transportation",
    "Security Services",
    "Cleaning Services",
    "Office Supplies",
  ];

  const noticeTypes = [
    "Advance Contract Award Notice",
    "Request for Proposal",
    "Request for Quotation",
    "Invitation to Qualify",
    "Contract Award Notice",
    "Standing Offer",
  ];

  const tenderStatuses = ["Active", "Open", "Closed", "Cancelled", "Awarded"];

  // Extract unique organizations from tender data
  const organizations = Array.from(
    new Set(
      tenders
        .map((t) => t.contracting_entity_name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 20) // Limit to top 20 most common
    )
  ).sort();

  const filterButtons = [
    {
      icon: Tag,
      label: "Category",
      key: "category",
      options: procurementCategories.map((cat) => ({ value: cat, label: cat })),
    },
    {
      icon: MapPin,
      label: "Region",
      key: "region",
      options: regions.map((region) => ({ value: region, label: region })),
    },
    {
      icon: Buildings,
      label: "Organization",
      key: "organization",
      options: organizations.map((org) => ({ value: org, label: org })),
    },
    {
      icon: FunnelSimple,
      label: "Notice Type",
      key: "notice_type",
      options: noticeTypes.map((type) => ({ value: type, label: type })),
    },
    {
      icon: Clock,
      label: "Status",
      key: "status",
      options: tenderStatuses.map((status) => ({
        value: status,
        label: status,
      })),
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tenders based on active filters
  useEffect(() => {
    if (!onFilteredDataChange) return;

    let filtered = tenders;

    // Apply active filters
    activeFilters.forEach((filter) => {
      filtered = filtered.filter((tender) => {
        switch (filter.type) {
          case "category":
            return tender.category_primary?.includes(filter.label);
          case "region":
            return (
              tender.contracting_entity_province === filter.label ||
              tender.delivery_location?.includes(filter.label)
            );
          case "organization":
            return tender.contracting_entity_name === filter.label;
          case "notice_type":
            return tender.procurement_type === filter.label;
          case "status":
            return tender.status === filter.label;
          default:
            return true;
        }
      });
    });

    onFilteredDataChange(filtered);
  }, [activeFilters, tenders, onFilteredDataChange]);

  const addFilter = (type: string, value: string, label: string) => {
    const filterId = `${type}-${value}`;
    if (!activeFilters.find((f) => f.id === filterId)) {
      setActiveFilters([...activeFilters, { id: filterId, label, type }]);
    }
    setShowDropdown(null);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((f) => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setGlobalFilter("");
  };

  const handleSearch = () => {
    setGlobalFilter(searchQuery);
  };

  const FilterDropdown = ({
    filter,
  }: {
    filter: (typeof filterButtons)[0];
  }) => (
    <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      <div className="p-2">
        {filter.options.map((option) => (
          <button
            key={option.value}
            onClick={() => addFilter(filter.key, option.value, option.label)}
            className="w-full text-left px-3 py-2 text-sm hover:bg-surface-muted rounded-lg transition-colors"
            disabled={activeFilters.some(
              (f) => f.id === `${filter.key}-${option.value}`
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-6">
      {/* Search Bar Row */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search tenders by title, description, or organization..."
            className="w-full pl-10 pr-24 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted"
          />
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Buttons Row */}
      <div className="flex items-center gap-4 mb-4 flex-wrap" ref={dropdownRef}>
        {filterButtons.map((filter) => (
          <div key={filter.key} className="relative">
            <button
              onClick={() =>
                setShowDropdown(showDropdown === filter.key ? null : filter.key)
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-surface-muted transition-colors"
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
              <CaretDown className="w-3 h-3" />
            </button>
            {showDropdown === filter.key && <FilterDropdown filter={filter} />}
          </div>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters Row */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-text">Filtered by:</span>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
              >
                <span>{filter.label}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-text-muted">
        {tenders.length > 0 && (
          <span>
            Showing {tenders.length} tender{tenders.length !== 1 ? "s" : ""}
            {activeFilters.length > 0 && " with active filters"}
          </span>
        )}
      </div>
    </div>
  );
};

export default QuickFilters;
