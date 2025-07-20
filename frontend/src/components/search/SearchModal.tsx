import { useState, useCallback } from "react";
import { MagnifyingGlass, Microphone, X, Sparkle } from "@phosphor-icons/react";

// Static data moved outside component
const exampleSearches = [
  "IT consulting projects in Toronto under $200K",
  "Healthcare software development opportunities",
  "Construction projects in BC closing next month",
  "Marketing services for federal departments",
  "Similar to projects I've won before",
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Memoize search handler
  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  // Memoize key press handler
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-text/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkle className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text">Smart Search</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-light hover:text-text-muted hover:bg-surface-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Content */}
        <div className="p-8">
          {/* Main Search Bar */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text mb-4 text-center">
              What kind of government contracts are you looking for?
            </h3>
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-text-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you're looking for... (e.g., 'Web development for healthcare under $150K')"
                className="w-full pl-12 pr-20 py-4 text-lg border-2 border-border rounded-xl focus:border-primary focus:ring-0 focus:outline-none bg-surface text-text placeholder-text-muted"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? "bg-error/10 text-error"
                      : "bg-surface-muted text-text-muted hover:bg-border"
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
              <div className="mt-3 bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
                🎤 Listening... Speak your requirements
              </div>
            )}
          </div>

          {/* Example Searches */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-text mb-4">
              Try these example searches:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleSearches.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(example)}
                  className="text-left p-4 bg-surface-muted border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MagnifyingGlass className="h-5 w-5 text-text-light mt-0.5 flex-shrink-0" />
                    <span className="text-text-muted">"{example}"</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-surface-warm rounded-xl p-6 border border-border-warm">
            <h4 className="text-lg font-semibold text-text mb-3">
              🤖 AI-Powered Search Features:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-text-muted">
                  Understands natural language
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-text-muted">
                  Finds hidden relevant opportunities
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-text-muted">
                  Shows relevance explanations
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-text-muted">
                  Learns from your preferences
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
