import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Clock
} from '@phosphor-icons/react';

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("Web development for healthcare under $150K");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Mock search results
  const searchResults = [
    {
      id: 1,
      title: "Digital Health Platform Development",
      organization: "Health Canada",
      value: "$125,000",
      deadline: "2025-08-15",
      location: "Ottawa, ON",
      relevanceScore: 94,
      matchReason: "web development + healthcare + budget match",
      type: "RFP",
      status: "Open",
      description: "Development of a comprehensive digital health platform to improve patient care coordination and data management across Canadian healthcare facilities.",
      closingDate: "15 days left",
      tags: ["Web Development", "Healthcare", "React", "Node.js"]
    },
    {
      id: 2,
      title: "Patient Portal Redesign",
      organization: "Ontario Health",
      value: "$89,000",
      deadline: "2025-08-10",
      location: "Toronto, ON",
      relevanceScore: 89,
      matchReason: "web development + healthcare sector",
      type: "RFQ",
      status: "Open",
      description: "Redesign and modernization of the existing patient portal to improve user experience and accessibility for Ontario residents.",
      closingDate: "10 days left",
      tags: ["UI/UX", "Healthcare", "Patient Portal", "Accessibility"]
    },
    {
      id: 3,
      title: "Medical Records System Update",
      organization: "Vancouver Coastal Health",
      value: "$145,000",
      deadline: "2025-09-01",
      location: "Vancouver, BC",
      relevanceScore: 85,
      matchReason: "healthcare + technology + similar budget",
      type: "RFP",
      status: "Open",
      description: "Upgrade and enhancement of the current electronic medical records system to improve data interoperability and security compliance.",
      closingDate: "27 days left",
      tags: ["EMR", "Healthcare", "Database", "Security"]
    },
    {
      id: 4,
      title: "Telehealth Platform Integration",
      organization: "Alberta Health Services",
      value: "$110,000",
      deadline: "2025-08-25",
      location: "Calgary, AB",
      relevanceScore: 82,
      matchReason: "healthcare technology + web platform",
      type: "RFP",
      status: "Open",
      description: "Integration of telehealth capabilities into existing healthcare management systems to support remote patient consultations.",
      closingDate: "21 days left",
      tags: ["Telehealth", "Integration", "Healthcare", "Video Conferencing"]
    }
  ];

  const filters = [
    { label: "Budget Range", options: ["Under $50K", "$50K-$100K", "$100K-$200K", "Over $200K"] },
    { label: "Location", options: ["Ontario", "British Columbia", "Alberta", "Quebec", "All Provinces"] },
    { label: "Type", options: ["RFP", "RFQ", "ITQ", "Standing Offer"] },
    { label: "Closing Date", options: ["This Week", "This Month", "Next 3 Months", "All"] }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="p-2 text-text-light hover:text-text hover:bg-border rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link to="/" className="text-2xl font-bold text-primary">
              Procuroo
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-light" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:border-primary focus:ring-0 focus:outline-none bg-background"
              placeholder="Search for government contracts..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Filters</h3>
              
              {filters.map((filter, index) => (
                <div key={index} className="mb-6">
                  <h4 className="text-sm font-medium text-text mb-2">{filter.label}</h4>
                  <div className="space-y-2">
                    {filter.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded border-border" />
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
                  Search Results for "{searchQuery}"
                </h1>
                <p className="text-text-light">
                  Found {searchResults.length} relevant contracts • Sorted by relevance
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
              {searchResults.map((result) => (
                <div key={result.id} className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  {/* Result Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-text hover:text-primary cursor-pointer">
                          {result.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {result.relevanceScore}% match
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {result.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-text-light mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {result.organization}
                        </div>
                        <div className="flex items-center gap-1">
                          <CurrencyDollar className="w-4 h-4" />
                          {result.value}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {result.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {result.closingDate}
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
                      <span className="text-sm font-medium text-blue-800">Why this matches:</span>
                    </div>
                    <p className="text-sm text-blue-700">{result.matchReason}</p>
                  </div>

                  {/* Description */}
                  <p className="text-text-light mb-4">{result.description}</p>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    {result.tags.map((tag, index) => (
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
                      Deadline: {result.deadline}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="text-primary hover:text-primary/80 font-medium">
                        View Details
                      </button>
                      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        View Tender
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
