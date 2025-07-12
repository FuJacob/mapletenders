import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type Tender } from "./types";

interface TendersState {
  data: Tender[];
  loading: boolean;
}

const initialState: TendersState = {
  data: [],
  loading: false,
};

const tendersSlice = createSlice({
  name: "tenders",
  initialState,
  reducers: {
    setTendersLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTenders: (state, action: PayloadAction<Tender[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    clearTenders: (state) => {
      state.data = [];
      state.loading = false;
    },
  },
});

export const { setTenders, setTendersLoading, clearTenders } =
  tendersSlice.actions;

export default tendersSlice.reducer;
