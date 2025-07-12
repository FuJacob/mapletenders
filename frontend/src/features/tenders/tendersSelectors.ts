import type { RootState } from "../../app/configureStore";

export const selectTenders = (state: RootState) => state.tenders.data;
export const selectTendersLoading = (state: RootState) => state.tenders.loading;
