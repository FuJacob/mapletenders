import React, { useState } from "react";
import {
  MagnifyingGlass,
  CalendarBlank,
  MapPin,
  Buildings,
  Tag,
  FunnelSimple,
  Clock,
} from "@phosphor-icons/react";
import { FilterButton, FilterTag } from "./filters";

const QuickFilters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock filtered tags - in real implementation these would be managed by filter state
  const mockFilteredTags = [
    { id: 1, label: "Information Technology", type: "category" },
    { id: 2, label: "Ontario", type: "province" },
    { id: 3, label: "Closing within 30 days", type: "deadline" },
    { id: 4, label: "RFP", type: "notice_type" },
  ];

  const filterButtons = [
    { icon: Tag, label: "Category" },
    { icon: MapPin, label: "Province/Region" },
    { icon: Buildings, label: "Organization" },
    { icon: CalendarBlank, label: "Closing Date" },
    { icon: Clock, label: "Status" },
    { icon: FunnelSimple, label: "Notice Type" },
  ];

  const removeFilter = (filterId: number) => {
    // Mock function - in real implementation would update filter state
    console.log("Remove filter:", filterId);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-6">
      {/* Search Bar Row */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenders by title, description, or organization..."
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
          />
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-light" />
        </div>
      </div>

      {/* Filter Buttons Row */}
      <div className="flex items-center gap-4 mb-4">
        {filterButtons.map((filter, index) => (
          <FilterButton
            key={index}
            icon={filter.icon}
            label={filter.label}
            onClick={() => console.log("Filter clicked:", filter.label)}
          />
        ))}
      </div>

      {/* Filtered By Row */}
      {mockFilteredTags.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">Filtered by:</span>
          <div className="flex flex-wrap gap-2">
            {mockFilteredTags.map((tag) => (
              <FilterTag
                key={tag.id}
                id={tag.id}
                label={tag.label}
                onRemove={removeFilter}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickFilters;
