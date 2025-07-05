import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type TenderNoticeInterface } from "./types";
const initialState: TenderNoticeInterface[] = [];

const tendersSlice = createSlice({
  name: "tenders",
  initialState,
  reducers: {
    setTenders: (_state, action: PayloadAction<TenderNoticeInterface[]>) => {
      return action.payload;
    },
    clearTenders: () => {
      return [];
    },
  },
});

export const { setTenders, clearTenders } = tendersSlice.actions;

export default tendersSlice.reducer;
