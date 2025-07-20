import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmitSearch: () => void;
  exampleSearches: string[];
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  onSubmitSearch,
  exampleSearches,
}: SearchSectionProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 text-center">
      <h2 className="text-3xl font-semibold text-text mb-4 p-4 text-center">
        What contracts are you here to win today?
      </h2>
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmitSearch();
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Try: 'IT services contracts in Toronto under $100K'"
          className="w-full p-6 text-lg border-2 border-border rounded-2xl pr-16 focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
        />
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
          onClick={onSubmitSearch}
        >
          <MagnifyingGlass className="w-4 h-4" />
          Search
        </button>
      </div>
      <div>
        <p className="text-sm text-text-light mb-2 text-center">
          Try these examples:
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {exampleSearches.map((example, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(example)}
              className="text-sm bg-surface border border-border text-text-light px-4 py-2 rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}