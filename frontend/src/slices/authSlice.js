import { createSlice } from "@reduxjs/toolkit";

function safeParseJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

const initialState = {
  userInfo: safeParseJson("userInfo", null),
  images: safeParseJson("images", []),
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
