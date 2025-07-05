const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:3000";
import { setTenders } from "./tendersSlice";
export const loadTenders = () => async (dispatch: any) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/getOpenTenderNoticesFromDB`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Raw fetch response:", response);
    const data = await response.json();
    console.log("Parsed tender data:", data);
    dispatch(setTenders(data));
    console.log("Tenders loaded successfully:", data);
  } catch (error) {
    console.error("Error fetching tenders:", error);
  }
};
