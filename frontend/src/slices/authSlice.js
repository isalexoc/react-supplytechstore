import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  images: localStorage.getItem("images")
    ? JSON.parse(localStorage.getItem("images"))
    : [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    },
    setImagesToState: (state, action) => {
      state.images = action.payload;
      localStorage.setItem("images", JSON.stringify(action.payload));
    },
    clearImages: (state) => {
      state.images = [];
      localStorage.removeItem("images");
    },
  },
});

export const { setCredentials, logout, setImagesToState, clearImages } =
  authSlice.actions;

export default authSlice.reducer;
