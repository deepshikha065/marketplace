import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: "",
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    }
  },
});

export const { setAccount } = walletSlice.actions;
export default walletSlice.reducer;
