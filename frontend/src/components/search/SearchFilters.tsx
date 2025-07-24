interface SearchFiltersProps {
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  selectedProcurementMethod: string;
  setSelectedProcurementMethod: (method: string) => void;
  selectedProcurementCategories: string[];
  setSelectedProcurementCategories: (categories: string[]) => void;
  selectedNoticeTypes: string[];
  setSelectedNoticeTypes: (types: string[]) => void;
  selectedStatus: string[];
  setSelectedStatus: (status: string[]) => void;
  selectedContractingEntities: string[];
  setSelectedContractingEntities: (entities: string[]) => void;
  closingDateAfter: string;
  setClosingDateAfter: (date: string) => void;
  closingDateBefore: string;
  setClosingDateBefore: (date: string) => void;
  publicationDateAfter: string;
  setPublicationDateAfter: (date: string) => void;
  publicationDateBefore: string;
  setPublicationDateBefore: (date: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

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

const procurementMethods = [
  "Request for Proposal",
  "Request for Quotation",
  "Invitation to Qualify",
  "Standing Offer",
];

const procurementCategories = [
  "Information Technology",
  "Construction",
  "Professional Services",
  "Security Services",
  "Consulting",
  "Engineering",
  "Maintenance",
];

const noticeTypes = [
  "Contract Award Notice",
  "Notice of Proposed Procurement",
  "Request for Information",
  "Contract Amendment",
];

const statusOptions = [
  "Open",
  "Closed",
  "Cancelled",
  "Awarded",
];

export default function SearchFilters({
  selectedRegions,
  setSelectedRegions,
  selectedProcurementMethod,
  setSelectedProcurementMethod,
  selectedProcurementCategories,
  setSelectedProcurementCategories,
  selectedNoticeTypes,
  setSelectedNoticeTypes,
  selectedStatus,
  setSelectedStatus,
  selectedContractingEntities,
  setSelectedContractingEntities,
  closingDateAfter,
  setClosingDateAfter,
  closingDateBefore,
  setClosingDateBefore,
  publicationDateAfter,
  setPublicationDateAfter,
  publicationDateBefore,
  setPublicationDateBefore,
  onApplyFilters,
  onResetFilters,
}: SearchFiltersProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Filters</h3>
        <button
          onClick={onResetFilters}
          className="text-xs text-text-muted hover:text-text transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[500px]">
        {/* Regions Filter */}
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Location</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {regions.map((region) => (
              <label
                key={region}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRegions([...selectedRegions, region]);
                    } else {
                      setSelectedRegions(
                        selectedRegions.filter((r) => r !== region)
                      );
                    }
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-text-muted">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Procurement Method Filter */}
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Procurement Method</h4>
          <div className="space-y-2">
            {procurementMethods.map((method) => (
              <label
                key={method}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="procurement_method"
                  value={method}
                  checked={selectedProcurementMethod === method}
                  onChange={(e) => setSelectedProcurementMethod(e.target.value)}
                  className="border-border text-primary focus:ring-primary"
                />
                <span className="text-text-muted">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Value Range */}
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Value Range</h4>
          <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
            <option value="">Any Value</option>
            <option value="0-100k">Under $100K</option>
            <option value="100k-500k">$100K - $500K</option>
            <option value="500k-1m">$500K - $1M</option>
            <option value="1m+">Over $1M</option>
          </select>
        </div>

        {/* Procurement Categories */}
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Category</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {procurementCategories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProcurementCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedProcurementCategories([...selectedProcurementCategories, category]);
                    } else {
                      setSelectedProcurementCategories(
                        selectedProcurementCategories.filter((c) => c !== category)
                      );
                    }
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-text-muted">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Closing Date Filter */}
        <div>
          <h4 className="text-sm font-medium text-text mb-2">Closing Date</h4>
          <div className="space-y-2">
            <input
              type="date"
              value={closingDateAfter}
              onChange={(e) => setClosingDateAfter(e.target.value)}
              placeholder="After"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
            <input
              type="date"
              value={closingDateBefore}
              onChange={(e) => setClosingDateBefore(e.target.value)}
              placeholder="Before"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onApplyFilters}
        className="w-full mt-6 bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        Apply Filters
      </button>
    </div>
  );
}