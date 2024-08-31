import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  config: null,
  menus: [],
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      return {
        ...state,
        config: action.payload,
      };
    },
    setMenus: (state, action) => {
      return {
        ...state,
        menus: action.payload,
      };
    },
  },
});

export const { setConfig, setMenus } = systemSlice.actions;
export default systemSlice.reducer;
