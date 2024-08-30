import store from 'store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: User.UserInfo = store.get('profile') || null;

const systemSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMenus: (_, action) => {
      return {
        ...action.payload,
      };
    },
  },
});

export const { setMenus } = systemSlice.actions;
export default systemSlice.reducer;

