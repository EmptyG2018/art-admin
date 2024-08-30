import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: User.UserInfo = store.get('profile') || null;

const userSlice = createSlice({
  name: 'user',
  initialState,
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
