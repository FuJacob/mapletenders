import { memo, useState, useEffect } from "react";
import { 
  Funnel, 
  MapPin, 
  CurrencyDollar, 
  Calendar, 
  Tag,
  X,
  ChartBar,
  Clock
} from "@phosphor-icons/react";

interface FilterOption {
  id: string;
  label: string;
  count: number;
  selected: boolean;
}

interface FilterGroup {
  id: string;
  title: string;
  icon: JSX.Element;
  options: FilterOption[];
  expanded: boolean;
  type: 'checkbox' | 'radio' | 'range' | 'date';
}

interface ActiveFilter {
  id: string;
  group: string;
  label: string;
  value: any;
}

interface FilterSidebarProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  resultsCount?: number;
  loading?: boolean;
  className?: string;
}

const FilterSidebar = memo(function FilterSidebar({
  onFiltersChange,
  resultsCount = 0,
  loading = false,
  className = ""
}: FilterSidebarProps) {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: 'location',
      title: 'Location',
      icon: <MapPin className="w-4 h-4" />,
      expanded: true,
      type: 'checkbox',
      options: [
        { id: 'ON', label: 'Ontario', count: 1247, selected: false },
        { id: 'BC', label: 'British Columbia', count: 892, selected: false },
        { id: 'QC', label: 'Quebec', count: 756, selected: false },
        { id: 'AB', label: 'Alberta', count: 534, selected: false },
        { id: 'MB', label: 'Manitoba', count: 312, selected: false },
        { id: 'NS', label: 'Nova Scotia', count: 289, selected: false },
        { id: 'NB', label: 'New Brunswick', count: 234, selected: false },
        { id: 'SK', label: 'Saskatchewan', count: 187, selected: false },
      ],
    },
    {
      id: 'category',
      title: 'Category',
      icon: <Tag className="w-4 h-4" />,
      expanded: true,
      type: 'checkbox',
      options: [
        { id: 'it', label: 'Information Technology', count: 567, selected: false },
        { id: 'construction', label: 'Construction', count: 423, selected: false },
        { id: 'professional', label: 'Professional Services', count: 389, selected: false },
        { id: 'healthcare', label: 'Healthcare', count: 298, selected: false },
        { id: 'transportation', label: 'Transportation', count: 234, selected: false },
        { id: 'environmental', label: 'Environmental', count: 187, selected: false },
        { id: 'security', label: 'Security Services', count: 156, selected: false },
        { id: 'consulting', label: 'Consulting', count: 134, selected: false },
      ],
    },
    {
      id: 'value',
      title: 'Contract Value',
      icon: <CurrencyDollar className="w-4 h-4" />,
      expanded: false,
      type: 'checkbox',
      options: [
        { id: 'under-50k', label: 'Under $50,000', count: 892, selected: false },
        { id: '50k-100k', label: '$50,000 - $100,000', count: 567, selected: false },
        { id: '100k-500k', label: '$100,000 - $500,000', count: 423, selected: false },
        { id: '500k-1m', label: '$500,000 - $1M', count: 234, selected: false },
        { id: '1m-5m', label: '$1M - $5M', count: 156, selected: false },
        { id: 'over-5m', label: 'Over $5M', count: 89, selected: false },
      ],
    },
    {
      id: 'timeline',
      title: 'Deadline',
      icon: <Clock className="w-4 h-4" />,
      expanded: false,
      type: 'checkbox',
      options: [
        { id: 'today', label: 'Closing Today', count: 23, selected: false },
        { id: 'week', label: 'Within 1 Week', count: 156, selected: false },
        { id: 'month', label: 'Within 1 Month', count: 567, selected: false },
        { id: 'quarter', label: 'Within 3 Months', count: 1234, selected: false },
        { id: 'open', label: 'Open Period', count: 345, selected: false },
      ],
    },
    {
      id: 'procurement',
      title: 'Procurement Type',
      icon: <ChartBar className="w-4 h-4" />,
      expanded: false,
      type: 'checkbox',
      options: [
        { id: 'rfp', label: 'Request for Proposal', count: 789, selected: false },
        { id: 'rfq', label: 'Request for Quotation', count: 567, selected: false },
        { id: 'itt', label: 'Invitation to Tender', count: 423, selected: false },
        { id: 'standing-offer', label: 'Standing Offer', count: 298, selected: false },
        { id: 'rfi', label: 'Request for Information', count: 187, selected: false },
      ],
    },
    {
      id: 'source',
      title: 'Source',
      icon: <Tag className="w-4 h-4" />,
      expanded: false,
      type: 'checkbox',
      options: [
        { id: 'federal', label: 'Government of Canada', count: 1456, selected: false },
        { id: 'ontario', label: 'Province of Ontario', count: 892, selected: false },
        { id: 'toronto', label: 'City of Toronto', count: 345, selected: false },
        { id: 'bc', label: 'Province of BC', count: 298, selected: false },
        { id: 'quebec', label: 'Province of Quebec', count: 234, selected: false },
      ],
    },
  ]);

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });

  useEffect(() => {
    // Emit filter changes to parent
    const filters = buildFiltersObject();
    onFiltersChange(filters);
  }, [filterGroups, priceRange]);

  const buildFiltersObject = () => {
    const filters: Record<string, any> = {};
    
    filterGroups.forEach(group => {
      const selectedOptions = group.options.filter(option => option.selected);
      if (selectedOptions.length > 0) {
        filters[group.id] = selectedOptions.map(option => option.id);
      }
    });

    if (priceRange.min > 0 || priceRange.max < 10000000) {
      filters.priceRange = priceRange;
    }

    return filters;
  };

  const toggleFilterGroup = (groupId: string) => {
    setFilterGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, expanded: !group.expanded }
          : group
      )
    );
  };

  const toggleFilterOption = (groupId: string, optionId: string) => {
    setFilterGroups(prev => 
      prev.map(group => 
        group.id === groupId
          ? {
              ...group,
              options: group.options.map(option =>
                option.id === optionId
                  ? { ...option, selected: !option.selected }
                  : option
              )
            }
          : group
      )
    );

    // Update active filters
    const group = filterGroups.find(g => g.id === groupId);
    const option = group?.options.find(o => o.id === optionId);
    
    if (group && option) {
      if (option.selected) {
        // Remove from active filters
        setActiveFilters(prev => 
          prev.filter(filter => !(filter.group === groupId && filter.id === optionId))
        );
      } else {
        // Add to active filters
        setActiveFilters(prev => [
          ...prev,
          {
            id: optionId,
            group: groupId,
            label: option.label,
            value: option.id,
          }
        ]);
      }
    }
  };

  const removeActiveFilter = (filterId: string, groupId: string) => {
    toggleFilterOption(groupId, filterId);
  };

  const clearAllFilters = () => {
    setFilterGroups(prev => 
      prev.map(group => ({
        ...group,
        options: group.options.map(option => ({
          ...option,
          selected: false,
        }))
      }))
    );
    setActiveFilters([]);
    setPriceRange({ min: 0, max: 10000000 });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCount = (count: number) => {
    return new Intl.NumberFormat('en-CA').format(count);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg h-fit ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Funnel className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-text">Filters</h3>
          </div>
          <div className="text-sm text-text-light">
            {loading ? (
              <div className="w-4 h-4 border-2 border-text-light/30 border-t-text-light rounded-full animate-spin" />
            ) : (
              `${formatCount(resultsCount)} results`
            )}
          </div>
        </div>
        
        {activeFilters.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text">Active Filters</span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-text-light hover:text-text"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={`${filter.group}-${filter.id}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg"
                >
                  {filter.label}
                  <button
                    onClick={() => removeActiveFilter(filter.id, filter.group)}
                    className="hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Groups */}
      <div className="divide-y divide-border max-h-[70vh] overflow-y-auto">
        {filterGroups.map((group) => (
          <div key={group.id} className="p-4">
            <button
              onClick={() => toggleFilterGroup(group.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-primary">{group.icon}</span>
                <span className="font-medium text-text">{group.title}</span>
                {group.options.some(opt => opt.selected) && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {group.options.filter(opt => opt.selected).length}
                  </span>
                )}
              </div>
              <span className="text-text-light">
                {group.expanded ? '−' : '+'}
              </span>
            </button>

            {group.expanded && (
              <div className="mt-3 space-y-2">
                {group.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={option.selected}
                        onChange={() => toggleFilterOption(group.id, option.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text group-hover:text-primary transition-colors truncate">
                        {option.label}
                      </span>
                    </div>
                    <span className="text-xs text-text-light ml-2">
                      {formatCount(option.count)}
                    </span>
                  </label>
                ))}
                
                {group.options.length > 8 && (
                  <button className="text-xs text-primary hover:text-primary/80 mt-2">
                    Show more...
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Price Range Filter */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CurrencyDollar className="w-4 h-4 text-primary" />
            <span className="font-medium text-text">Custom Price Range</span>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-text-light mb-1">Min</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className="w-full px-2 py-1 text-xs border border-border rounded focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-text-light mb-1">Max</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 10000000 }))}
                  placeholder="No limit"
                  className="w-full px-2 py-1 text-xs border border-border rounded focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="text-xs text-text-light">
              {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-t border-border bg-surface-muted">
        <h4 className="text-sm font-medium text-text mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
            🔥 Hot Opportunities (Closing Soon)
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
            💰 High Value ($1M+)
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
            🚀 New This Week
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-text hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
            🎯 Perfect Match (90%+)
          </button>
        </div>
      </div>
    </div>
  );
});

export default FilterSidebar;