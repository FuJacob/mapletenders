import { setTenders, setTendersLoading } from "./tendersSlice";
import type { AppDispatch, RootState } from "../../app/configureStore";

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
      // TODO: Replace with proper tender loading mechanism
      // The old getOpenTenderNoticesFromDB was removed as it was broken
      dispatch(setTenders([]));
    } catch (error) {
      console.error("Error fetching tenders:", error);
      dispatch(setTendersLoading(false));
    }
  };
