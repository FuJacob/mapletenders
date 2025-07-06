import { MagnifyingGlass, Sparkle, TrendUp, Clock, MapPin } from '@phosphor-icons/react';

interface SearchHeroProps {
  onSearchClick: () => void;
}

export default function SearchHero({ onSearchClick }: SearchHeroProps) {
  const quickFilters = [
    { icon: MapPin, label: "In my region", count: "23 new", color: "bg-blue-50 text-blue-600" },
    { icon: Clock, label: "Closing soon", count: "8 urgent", color: "bg-orange-50 text-orange-600" },
    { icon: TrendUp, label: "Under $100K", count: "45 active", color: "bg-green-50 text-green-600" },
  ];

  const exampleSearches = [
    "IT consulting projects in Toronto under $200K",
    "Healthcare software development opportunities", 
    "Construction projects in BC closing next month",
    "Marketing services for federal departments"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Main heading */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">
              Find Government Contracts in Plain English
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stop hunting through databases. Just describe what you're looking for and let our AI find the perfect opportunities.
          </p>
        </div>

        {/* Main search bar - clickable */}
        <div className="relative mb-6">
          <div 
            onClick={onSearchClick}
            className="relative cursor-pointer group"
          >
            <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
            <div className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl group-hover:border-primary group-hover:shadow-lg transition-all bg-white text-left text-gray-500">
              Describe what you're looking for... (e.g., "Web development for healthcare under $150K")
            </div>
          </div>
        </div>

        {/* Example searches */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-3">Try these example searches:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleSearches.map((example, index) => (
              <button
                key={index}
                onClick={onSearchClick}
                className="text-sm bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-primary hover:bg-blue-50 transition-colors text-gray-700"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Quick filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickFilters.map((filter, index) => (
            <button
              key={index}
              onClick={onSearchClick}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${filter.color}`}>
                  <filter.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{filter.label}</div>
                  <div className="text-sm text-gray-600">{filter.count}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <button 
            onClick={onSearchClick}
            className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Start Smart Search
          </button>
        </div>
      </div>
    </div>
  );
}
