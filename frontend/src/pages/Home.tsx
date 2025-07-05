import { useEffect } from "react";
import { loadTenders } from "../features/tenders/tendersThunk";

import { useAppDispatch } from "../app/hooks";
import { Link } from "react-router-dom";
export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadTenders());
  }, [dispatch]);
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
      <Link to="/test">Go to table</Link>
    </div>
  );
}
