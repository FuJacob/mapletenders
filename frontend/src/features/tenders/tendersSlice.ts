import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type Tender } from "./types";
const initialState: Tender[] = [];

const tendersSlice = createSlice({
  name: "tenders",
  initialState,
  reducers: {
    setTenders: (_state, action: PayloadAction<Tender[]>) => {
      return action.payload;
    },
    clearTenders: () => {
      return [];
    },
  },
});

export const { setTenders, clearTenders } = tendersSlice.actions;

export default tendersSlice.reducer;
