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
  rowCount: number;
  // New props for server-side pagination
  usePagination?: boolean;
  onSearchChange?: (search: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
}

interface FilterOption {
  id: string;
  label: string;
  type: string;
}

const QuickFilters = ({
  setGlobalFilter,
  tenders = [],
  rowCount,
  onFilteredDataChange,
  usePagination = false,
  onSearchChange,
  onFilterChange,
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
      const newFilters = [...activeFilters, { id: filterId, label, type }];
      setActiveFilters(newFilters);

      // Update server-side filters if using pagination
      if (usePagination && onFilterChange) {
        const filterParams: Record<string, string> = {};
        newFilters.forEach((filter) => {
          const [filterType, filterValue] = filter.id.split("-");
          if (filterType === "regions") {
            filterParams.region = filterValue;
          } else if (filterType === "categories") {
            filterParams.category = filterValue;
          } else if (filterType === "statuses") {
            filterParams.status = filterValue;
          } else if (filterType === "entities") {
            filterParams.entity = filterValue;
          }
        });
        onFilterChange(filterParams);
      }
    }
    setShowDropdown(null);
  };

  const removeFilter = (filterId: string) => {
    const newFilters = activeFilters.filter((f) => f.id !== filterId);
    setActiveFilters(newFilters);

    // Update server-side filters if using pagination
    if (usePagination && onFilterChange) {
      const filterParams: Record<string, string> = {};
      newFilters.forEach((filter) => {
        const [filterType, filterValue] = filter.id.split("-");
        if (filterType === "regions") {
          filterParams.region = filterValue;
        } else if (filterType === "categories") {
          filterParams.category = filterValue;
        } else if (filterType === "statuses") {
          filterParams.status = filterValue;
        } else if (filterType === "entities") {
          filterParams.entity = filterValue;
        }
      });
      onFilterChange(filterParams);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");

    if (usePagination && onSearchChange && onFilterChange) {
      onSearchChange("");
      onFilterChange({});
    } else {
      setGlobalFilter("");
    }
  };

  const handleSearch = () => {
    if (usePagination && onSearchChange) {
      onSearchChange(searchQuery);
    } else {
      setGlobalFilter(searchQuery);
    }
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
    <div className="bg-surface border border-border rounded-lg p-3 flex-1">
      {/* Search Bar Row - Compact */}
      <div className="mb-2">
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
            placeholder="Search tenders..."
            className="w-full pl-8 pr-20 py-2 text-sm border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-muted"
          />
          <MagnifyingGlass className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filter Buttons Row - Compact */}
      <div className="flex items-center gap-2 mb-2 flex-wrap" ref={dropdownRef}>
        {filterButtons.map((filter) => (
          <div key={filter.key} className="relative">
            <button
              onClick={() =>
                setShowDropdown(showDropdown === filter.key ? null : filter.key)
              }
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium border border-border rounded hover:bg-surface-muted transition-colors"
            >
              <filter.icon className="w-3 h-3" />
              {filter.label}
              <CaretDown className="w-2.5 h-2.5" />
            </button>
            {showDropdown === filter.key && <FilterDropdown filter={filter} />}
          </div>
        ))}

        {activeFilters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters Row - Compact */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-text">Filters:</span>
          <div className="flex flex-wrap gap-1.5">
            {activeFilters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded border border-primary/20"
              >
                <span>{filter.label}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="hover:bg-primary/20 rounded p-0.5 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary - Compact */}
      <div className="text-xs text-text-muted">
        <span>
          {rowCount} tender{rowCount !== 1 ? "s" : ""}
          {activeFilters.length > 0 && " filtered"}
        </span>
      </div>
    </div>
  );
};

export default QuickFilters;
