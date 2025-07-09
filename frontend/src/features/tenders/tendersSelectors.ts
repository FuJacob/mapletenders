import type { RootState } from "../../app/configureStore";

export const selectTenders = (state: RootState) => state.tenders;
