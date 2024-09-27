import storage from 'store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: User.UserInfo = storage.get('profile') || null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (_, action) => {
      return {
        ...action.payload,
      };
    },
  },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;
