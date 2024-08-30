import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducer/user';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;
