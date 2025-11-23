import { useState } from "react";
import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";
import {
  clearAllTenders,
  resetRefreshLock,
  syncToElasticsearch,
} from "../api/tenders";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClearTenders = async () => {
    if (
      !confirm(
        "⚠️ Are you sure you want to DELETE ALL TENDERS? This cannot be undone!"
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await clearAllTenders();
      setMessage(`✅ ${result.message}`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetLock = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await resetRefreshLock();
      setMessage(`✅ ${result.message}`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncElasticsearch = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await syncToElasticsearch();
      setMessage(`✅ ${result.message}`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 font-bold">Test Page</h1>

      {/* Admin Actions */}
      <div className="mb-8 p-6 bg-surface border border-border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleClearTenders}
            disabled={loading}
            className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Processing..." : "🗑️ Clear All Tenders"}
          </button>

          <button
            onClick={handleResetLock}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Processing..." : "🔓 Reset Refresh Lock"}
          </button>

          <button
            onClick={handleSyncElasticsearch}
            disabled={loading}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Processing..." : "🔄 Sync to Elasticsearch"}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("✅")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      {/* Test Content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tender Notice Test</h2>
        <TenderNoticeFullContent tenderId="MX-443538968279" />
      </div>
    </div>
  );
}
