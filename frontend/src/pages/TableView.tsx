import TenderTable from "../components/table/TenderTable";

export default function TableView() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tender Opportunities
        </h1>
        <TenderTable />
      </div>
    </div>
  );
}
