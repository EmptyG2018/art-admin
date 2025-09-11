import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducer/user';
import systemReducer from './reducer/system';

const store = configureStore({
  reducer: {
    user: userReducer,
    system: systemReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;
