import { memo, useState, useEffect } from "react";
import { 
  MagnifyingGlass, 
  MapPin, 
  CurrencyDollar, 
  Calendar, 
  Tag,
  Funnel,
  X,
  Plus
} from "@phosphor-icons/react";

export interface SearchFilters {
  query: string;
  location: {
    provinces: string[];
    cities: string[];
    regions: string[];
  };
  financial: {
    minValue: number | null;
    maxValue: number | null;
    currency: string;
  };
  timeline: {
    publishedAfter: Date | null;
    closingBefore: Date | null;
    contractStart: Date | null;
  };
  categories: {
    industries: string[];
    procurementTypes: string[];
    methods: string[];
  };
  advanced: {
    keywords: string[];
    excludeKeywords: string[];
    minimumMatchScore: number;
    onlyRecommended: boolean;
  };
}

interface AdvancedSearchFormProps {
  initialFilters?: Partial<SearchFilters>;
  onSearch: (filters: SearchFilters) => void;
  onSaveSearch?: (filters: SearchFilters, name: string) => void;
  loading?: boolean;
  className?: string;
}

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

const INDUSTRIES = [
  'Information Technology',
  'Construction',
  'Professional Services',
  'Healthcare',
  'Transportation',
  'Environmental Services',
  'Security Services',
  'Consulting',
  'Engineering',
  'Education',
  'Research & Development',
  'Manufacturing',
];

const PROCUREMENT_TYPES = [
  'Request for Proposal (RFP)',
  'Request for Quotation (RFQ)',
  'Request for Information (RFI)',
  'Invitation to Tender (ITT)',
  'Standing Offer',
  'Supply Arrangement',
  'Call-up Against Standing Offer',
];

const PROCUREMENT_METHODS = [
  'Open Competition',
  'Invitational Competition',
  'Sole Source',
  'Limited Tendering',
  'Electronic Tendering',
  'Two-Stage Tendering',
];

const AdvancedSearchForm = memo(function AdvancedSearchForm({
  initialFilters,
  onSearch,
  onSaveSearch,
  loading = false,
  className = ""
}: AdvancedSearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: {
      provinces: [],
      cities: [],
      regions: [],
    },
    financial: {
      minValue: null,
      maxValue: null,
      currency: 'CAD',
    },
    timeline: {
      publishedAfter: null,
      closingBefore: null,
      contractStart: null,
    },
    categories: {
      industries: [],
      procurementTypes: [],
      methods: [],
    },
    advanced: {
      keywords: [],
      excludeKeywords: [],
      minimumMatchScore: 0.7,
      onlyRecommended: false,
    },
    ...initialFilters,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newExcludeKeyword, setNewExcludeKeyword] = useState('');
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    financial: false,
    timeline: false,
    categories: false,
    advanced: false,
  });

  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  const handleInputChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (section: keyof SearchFilters, field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayToggle = (section: keyof SearchFilters, field: string, value: string) => {
    setFilters(prev => {
      const currentArray = (prev[section] as any)[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  const addKeyword = (type: 'keywords' | 'excludeKeywords') => {
    const keyword = type === 'keywords' ? newKeyword : newExcludeKeyword;
    if (keyword.trim()) {
      handleArrayToggle('advanced', type, keyword.trim());
      if (type === 'keywords') {
        setNewKeyword('');
      } else {
        setNewExcludeKeyword('');
      }
    }
  };

  const removeKeyword = (type: 'keywords' | 'excludeKeywords', keyword: string) => {
    setFilters(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [type]: prev.advanced[type].filter(k => k !== keyword),
      },
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim() && onSaveSearch) {
      onSaveSearch(filters, saveSearchName.trim());
      setSaveSearchName('');
      setShowSaveSearch(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      location: { provinces: [], cities: [], regions: [] },
      financial: { minValue: null, maxValue: null, currency: 'CAD' },
      timeline: { publishedAfter: null, closingBefore: null, contractStart: null },
      categories: { industries: [], procurementTypes: [], methods: [] },
      advanced: { keywords: [], excludeKeywords: [], minimumMatchScore: 0.7, onlyRecommended: false },
    });
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`bg-surface border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Funnel className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Advanced Search</h3>
              <p className="text-sm text-text-light">Find exactly what you're looking for</p>
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-text-light hover:text-text transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Search Query */}
        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Search Query
          </label>
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-light" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleInputChange('query', e.target.value)}
              placeholder="e.g., software development, IT consulting, cloud services"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Location Filters */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-text">Location</span>
              {filters.location.provinces.length > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {filters.location.provinces.length}
                </span>
              )}
            </div>
            <span className="text-text-light">
              {expandedSections.location ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.location && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Provinces/Territories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PROVINCES.map((province) => (
                    <label key={province.code} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.location.provinces.includes(province.code)}
                        onChange={() => handleArrayToggle('location', 'provinces', province.code)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text">{province.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Financial Filters */}
        <div>
          <button
            onClick={() => toggleSection('financial')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <CurrencyDollar className="w-4 h-4 text-primary" />
              <span className="font-medium text-text">Contract Value</span>
              {(filters.financial.minValue || filters.financial.maxValue) && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Set
                </span>
              )}
            </div>
            <span className="text-text-light">
              {expandedSections.financial ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.financial && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Minimum Value (CAD)
                </label>
                <input
                  type="number"
                  value={filters.financial.minValue || ''}
                  onChange={(e) => handleNestedChange('financial', 'minValue', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Maximum Value (CAD)
                </label>
                <input
                  type="number"
                  value={filters.financial.maxValue || ''}
                  onChange={(e) => handleNestedChange('financial', 'maxValue', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Timeline Filters */}
        <div>
          <button
            onClick={() => toggleSection('timeline')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium text-text">Timeline</span>
              {(filters.timeline.publishedAfter || filters.timeline.closingBefore) && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Set
                </span>
              )}
            </div>
            <span className="text-text-light">
              {expandedSections.timeline ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.timeline && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Published After
                </label>
                <input
                  type="date"
                  value={filters.timeline.publishedAfter?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleNestedChange('timeline', 'publishedAfter', e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Closing Before
                </label>
                <input
                  type="date"
                  value={filters.timeline.closingBefore?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleNestedChange('timeline', 'closingBefore', e.target.value ? new Date(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <span className="font-medium text-text">Categories</span>
              {(filters.categories.industries.length > 0 || filters.categories.procurementTypes.length > 0) && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {filters.categories.industries.length + filters.categories.procurementTypes.length}
                </span>
              )}
            </div>
            <span className="text-text-light">
              {expandedSections.categories ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.categories && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Industries
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {INDUSTRIES.map((industry) => (
                    <label key={industry} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.industries.includes(industry)}
                        onChange={() => handleArrayToggle('categories', 'industries', industry)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Procurement Types
                </label>
                <div className="space-y-2">
                  {PROCUREMENT_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.procurementTypes.includes(type)}
                        onChange={() => handleArrayToggle('categories', 'procurementTypes', type)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-text">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div>
          <button
            onClick={() => toggleSection('advanced')}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Funnel className="w-4 h-4 text-primary" />
              <span className="font-medium text-text">Advanced Options</span>
              {(filters.advanced.keywords.length > 0 || filters.advanced.onlyRecommended) && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Set
                </span>
              )}
            </div>
            <span className="text-text-light">
              {expandedSections.advanced ? '−' : '+'}
            </span>
          </button>
          
          {expandedSections.advanced && (
            <div className="mt-4 space-y-4">
              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Required Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword('keywords')}
                  />
                  <button
                    onClick={() => addKeyword('keywords')}
                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.advanced.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-lg"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword('keywords', keyword)}
                        className="hover:text-primary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Match Score */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Minimum Match Score: {Math.round(filters.advanced.minimumMatchScore * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.advanced.minimumMatchScore}
                  onChange={(e) => handleNestedChange('advanced', 'minimumMatchScore', parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-light mt-1">
                  <span>Any match</span>
                  <span>Perfect match</span>
                </div>
              </div>

              {/* Only Recommended */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.advanced.onlyRecommended}
                    onChange={(e) => handleNestedChange('advanced', 'onlyRecommended', e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text">Show only AI-recommended tenders</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onSaveSearch && (
              <>
                {showSaveSearch ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={saveSearchName}
                      onChange={(e) => setSaveSearchName(e.target.value)}
                      placeholder="Search name..."
                      className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveSearch()}
                    />
                    <button
                      onClick={handleSaveSearch}
                      disabled={!saveSearchName.trim()}
                      className="px-3 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowSaveSearch(false)}
                      className="px-3 py-2 text-text-light hover:text-text"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSaveSearch(true)}
                    className="px-3 py-2 text-text-light hover:text-text border border-border rounded-lg"
                  >
                    Save Search
                  </button>
                )}
              </>
            )}
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MagnifyingGlass className="w-4 h-4" />
            )}
            Search Tenders
          </button>
        </div>
      </div>
    </div>
  );
});

export default AdvancedSearchForm;