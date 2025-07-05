import { useEffect } from "react";
import TenderTable from "../components/table/TenderTable";
import { getOpenTenderNoticesToDB } from "../api";
const refreshTenders = async () => {
  try {
    await getOpenTenderNoticesToDB();
  } catch (e) {
    console.log(e);
  }
};

export default function Test() {
  useEffect(() => {
    refreshTenders();
  }, []);
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <TenderTable />
    </div>
  );
}
