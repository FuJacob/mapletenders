export default function SetViewHeader({
  view,
  setView,
}: {
  setView: (view: "search" | "table") => void;
  view: "search" | "table";
}) {
  return (
    <div className=" rounded-xl mb-8 mx-auto max-w-2xl text-center py-6">
      <div className="flex justify-center items-center gap-4">
        <div className=" flex flex-col gap-2 text-center">
          <h2 className="text-sm font-light text-text-muted">Select a view</h2>
          <div className="flex gap-2 rounded-lg p-1 bg-surface items-center justify-center transition-all duration-300">
            <button
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                view === "search"
                  ? "bg-primary text-white"
                  : "text-text-light hover:bg-border"
              }`}
              onClick={() => setView("search")}
            >
              Search
            </button>
            <button
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                view === "table"
                  ? "bg-primary text-white"
                  : "text-text-light hover:bg-border"
              }`}
              onClick={() => setView("table")}
            >
              Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
