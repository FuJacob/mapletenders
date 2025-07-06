import { useEffect } from "react";
import TenderTable from "../components/table/TenderTable";
import { getOpenTenderNoticesToDB } from "../api";
import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { loadTenders } from "../features/tenders/tendersThunk";
export default function Test() {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  useEffect(() => {
    dispatch(loadTenders());
    // getOpenTenderNoticesToDB();
    setTimeout(() => {
      setShow(true);
    }, 1000);
  }, [dispatch]);
  if (show) {
    return <TenderTable />;
  }
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page.</p>
    </div>
  );
}
