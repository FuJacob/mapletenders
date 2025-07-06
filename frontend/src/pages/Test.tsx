import { useEffect } from "react";
import TenderTable from "../components/table/TenderTable";
import { getOpenTenderNoticesToDB } from "../api";

export default function Test() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
      <TenderTable />
    </div>
  );
}
