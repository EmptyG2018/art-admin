import storage from "store";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: storage.get("userInfo") || null,
  reducers: {
    setUserInfo: (_, action) => {
      return {
        ...action.payload,
      };
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
