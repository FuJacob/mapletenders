import { useState, useCallback } from 'react';
import { MagnifyingGlass, Microphone, X, Sparkle } from '@phosphor-icons/react';

// Static data moved outside component
const exampleSearches = [
  "IT consulting projects in Toronto under $200K",
  "Healthcare software development opportunities",
  "Construction projects in BC closing next month",
  "Marketing services for federal departments",
  "Similar to projects I've won before"
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Memoize search handler
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  // Memoize key press handler
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Content */}
        <div className="p-8">
          {/* Main Search Bar */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              What kind of government contracts are you looking for?
            </h3>
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you're looking for... (e.g., 'Web development for healthcare under $150K')"
                className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 focus:outline-none"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Microphone className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleSearch}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </div>
            {isListening && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                🎤 Listening... Speak your requirements
              </div>
            )}
          </div>

          {/* Example Searches */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Try these example searches:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleSearches.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(example)}
                  className="text-left p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MagnifyingGlass className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">"{example}"</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">🤖 AI-Powered Search Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Understands natural language</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Finds hidden relevant opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Shows relevance explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-gray-700">Learns from your preferences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
