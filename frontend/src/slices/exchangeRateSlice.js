import { createSlice } from "@reduxjs/toolkit";

const exchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState: {
    rate: null,
    source: null,
    dateKey: null,
  },
  reducers: {
    setExchangeRate(state, action) {
      const { rate, source, dateKey } = action.payload || {};
      state.rate = rate != null && Number.isFinite(rate) ? rate : state.rate;
      if (source !== undefined) state.source = source;
      if (dateKey !== undefined) state.dateKey = dateKey;
    },
  },
});

export const { setExchangeRate } = exchangeRateSlice.actions;
export default exchangeRateSlice.reducer;
