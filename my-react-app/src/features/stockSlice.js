import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { url, urlBP, setHeaders } from './api';

//react query

const initialState = {
  data: JSON.parse(localStorage.getItem("stockData")) || null,
  news: JSON.parse(localStorage.getItem("stockNews")) || [],
  trades: JSON.parse(localStorage.getItem("stockTrades")) || [],
  successRate: JSON.parse(localStorage.getItem("stockSuccessRate")) || 0,
  predictedPrice: JSON.parse(localStorage.getItem("stockPredictedPrice")) || null,
  portfolio: null,
  favorites: JSON.parse(localStorage.getItem("stockFavorites")) || [],
  error: null,
  loading: false,
  operationStatus: null,
  analystRecommendations: [],
};

export const fetchStockData = createAsyncThunk(
  'stock/fetchStockData',
  async ({ ticker, period, interval, movingAverages, strategy, fromDate, toDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${urlBP}/stock-data/`, {
        params: {
          ticker,
          period,
          interval,
          'ma_windows[]': movingAverages,
          strategy,
          from_date: fromDate,
          to_date: toDate,
        },
      });

      localStorage.setItem("stockData", JSON.stringify(response.data.stockdata));
      localStorage.setItem("stockNews", JSON.stringify(response.data.newsdata));
      localStorage.setItem("stockTrades", JSON.stringify(response.data.trades));
      localStorage.setItem("stockSuccessRate", JSON.stringify(response.data.success_rate));

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

export const fetchPredictedPrice = createAsyncThunk(
  'stock/fetchPredictedPrice',
  async ({ ticker, period, interval }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${urlBP}/predict/`, {
        params: {
          ticker,
          period,
          interval,
        },
      });

      localStorage.setItem("stockPredictedPrice", JSON.stringify(response.data.predicted_price));

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching predict');
    }
  }
);

export const fetchPortfolio = createAsyncThunk(
  'stock/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/portfolio`, setHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

export const fetchFavorites = createAsyncThunk(
  'stock/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/portfolio/favorites`, setHeaders());
      localStorage.setItem("stockFavorites", JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'stock/addFavorite',
  async (ticker, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/portfolio/favorite`, { ticker }, setHeaders());
      localStorage.setItem("stockFavorites", JSON.stringify(response.data.favorites));
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error adding to favorites');
    }
  }
);

export const buyStock = createAsyncThunk(
  'stock/buyStock',
  async ({ ticker, shares, price }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/portfolio/buy`, {
        ticker,
        shares: parseFloat(shares),
        price: parseFloat(price),
      }, setHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.msg : 'Error buying stock');
    }
  }
);

export const sellStock = createAsyncThunk(
  'stock/sellStock',
  async ({ ticker, shares, price }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/portfolio/sell`, {
        ticker,
        shares: parseFloat(shares),
        price: parseFloat(price),
      }, setHeaders());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.msg : 'Error selling stock');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'stock/removeFavorite',
  async (ticker, { rejectWithValue }) => {
    try {
      console.log("ti",ticker)
      const response = await axios.delete(`${url}/portfolio/rmfavorite/${ticker}`,  setHeaders());
      console.log("ga",response.data)
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error removing from favorites');
    }
  }
);

export const fetchAnalystRecommendations = createAsyncThunk(
  'stock/fetchAnalystRecommendations',
  async ({ ticker }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/analystrecommendations`, {
        params: { ticker },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data.error : 'Error fetching data');
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    resetOperationStatus: (state) => {
      state.operationStatus = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.stockdata;
        state.news = action.payload.newsdata;
        state.trades = action.payload.trades;
        state.successRate = action.payload.success_rate;
        state.operationStatus = 'fulfilled';
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.operationStatus = 'rejected';
      })
      .addCase(fetchPredictedPrice.fulfilled, (state , action) => {
        state.predictedPrice = action.payload.predicted_price;
      })
      .addCase(fetchPredictedPrice.rejected, (state , action) =>{
        state.error = action.payload;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.portfolio = action.payload;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
      })
      .addCase(buyStock.fulfilled, (state,action) => {
        state.portfolio = action.payload;
        state.operationStatus = 'fulfilled';
      })
      .addCase(buyStock.rejected , (state,action) =>{
        state.error = action.payload;
        state.operationStatus = 'rejected';
      })
      .addCase(sellStock.fulfilled, (state , action) =>{
        state.portfolio = action.payload;
        state.operationStatus = 'fulfilled';
      })
      .addCase(sellStock.rejected, (state , action) => {
        state.error = action.payload;
        state.operationStatus = 'rejected';
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload.favorites;
        state.operationStatus = 'fulfilled';
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
        state.operationStatus = 'rejected';
      })
      .addCase(fetchAnalystRecommendations.fulfilled, (state, action) => {
        state.analystRecommendations = action.payload;
      })
      .addCase(fetchAnalystRecommendations.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export const { resetOperationStatus} = stockSlice.actions;
export default stockSlice.reducer;
