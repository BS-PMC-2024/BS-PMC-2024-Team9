import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/authSlice';
import stockReducer from '../src/features/stockSlice';
import profileReducer from '../src/features/profileSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    profile: profileReducer,
  },
});

export default store;
