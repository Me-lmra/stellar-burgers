import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@utils/burger-api';

import type { RootState } from '@services/store';
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

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  return await getFeedsApi();
});

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
});

export const getFeedOrdersSelector = (state: RootState): TOrder[] => state.feed.orders;
export const getFeedTotalSelector = (state: RootState): number => state.feed.total;
export const getFeedTotalTodaySelector = (state: RootState): number =>
  state.feed.totalToday;
export const getFeedLoadingSelector = (state: RootState): boolean =>
  state.feed.isLoading;
export const getFeedErrorSelector = (state: RootState): string | null =>
  state.feed.error;

export const getOrderByNumberSelector = (
  state: RootState,
  number: number
): TOrder | null => state.feed.orders.find((order) => order.number === number) ?? null;

export const feedReducer = feedSlice.reducer;
