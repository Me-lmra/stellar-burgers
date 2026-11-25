import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@utils/burger-api';

import type { TOrder } from '@utils-types';

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0]; // API возвращает массив, берём первый элемент
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка загрузки ленты';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        const exists = state.orders.find((o) => o.number === action.payload.number);
        if (!exists) {
          state.orders.push(action.payload);
        }
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    getFeedOrdersSelector: (state) => state.orders,
    getFeedLoadingSelector: (state) => state.isLoading,
    getFeedErrorSelector: (state) => state.error,
    getFeedTotalSelector: (state) => state.total,
    getFeedTotalTodaySelector: (state) => state.totalToday,
    getOrderByNumberSelector: (state, number: number) =>
      state.orders.find((order) => order.number === number) ?? null,
  },
});

export const {
  getFeedOrdersSelector,
  getFeedLoadingSelector,
  getFeedErrorSelector,
  getFeedTotalSelector,
  getFeedTotalTodaySelector,
  getOrderByNumberSelector,
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;
