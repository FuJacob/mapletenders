import { setTenders, setTendersLoading } from "./tendersSlice";
import type { AppDispatch, RootState } from "../../app/configureStore";
import { getOpenTenderNoticesFromDB } from "../../api/tenders";

export const loadTenders =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    // Don't load if already loading
    if (state.tenders.loading) {
      console.log("Tenders already loading, skipping...");
      return;
    }

  try {
      dispatch(setTendersLoading(true));
    const data = await getOpenTenderNoticesFromDB();
    console.log("Parsed tender data:", data);
    dispatch(setTenders(data));
    console.log("Tenders loaded successfully:", data);
  } catch (error) {
    console.error("Error fetching tenders:", error);
      dispatch(setTendersLoading(false));
  }
};
