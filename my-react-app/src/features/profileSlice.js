import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setHeaders, url } from '../features/api';

// Async actions
export const fetchPortfolio = createAsyncThunk(
  'profile/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/portfolio`, setHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'profile/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/portfolio/transactions`, setHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

export const addMoney = createAsyncThunk(
  'profile/addMoney',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/user/add-money`, { amount }, setHeaders());
      return response.data.cash_balance;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error adding money');
    }
  }
);

export const withdrawMoney = createAsyncThunk(
  'profile/withdrawMoney',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/user/withdraw-money`, { amount }, setHeaders());
      return response.data.cash_balance;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error withdrawing money');
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'profile/updateUserPreferences',
  async ({ userId, preferences }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${url}/user/preferences`, { userId, preferences }, setHeaders());
      localStorage.setItem("userPreferences", JSON.stringify(response.data.preferences));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error updating preferences');
    }
  }
);

// Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    portfolio: null,
    transactions: [],
    error: null,
    loading: false,
    preferences: JSON.parse(localStorage.getItem("userPreferences")) || { language: 'English', timezone: 'UTC' },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolio = action.payload;
        state.loading = false;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload.preferences;
        state.operationStatus = 'fulfilled';
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus = 'rejected';
      })
      .addCase(addMoney.fulfilled, (state, action) => {
        if (state.portfolio) {
          state.portfolio.cash_balance = action.payload;
        }
      })
      .addCase(withdrawMoney.fulfilled, (state, action) => {
        if (state.portfolio) {
          state.portfolio.cash_balance = action.payload;
        }
      });
  },
});

export default profileSlice.reducer;
