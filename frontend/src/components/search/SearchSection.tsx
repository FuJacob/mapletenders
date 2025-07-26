import { MagnifyingGlass } from "@phosphor-icons/react";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmitSearch: () => void;
}

export default function SearchSection({
  searchQuery,
  setSearchQuery,
  onSubmitSearch,
}: SearchSectionProps) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmitSearch();
        }}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="What tenders can we find for you?"
        className="w-full p-6 text-lg border-2 border-border rounded-lg pr-16 focus:outline-none focus:border-primary bg-surface text-text placeholder-text-light"
      />
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        onClick={onSubmitSearch}
      >
        <MagnifyingGlass className="w-4 h-4" />
        Search
      </button>
    </div>
  );
}
