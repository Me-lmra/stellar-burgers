import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersApi } from '@utils/burger-api';

import type { TOrder } from '@utils-types';

export type TProfileState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk(
  'orders/fetchProfileOrders',
  getOrdersApi
);

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка загрузки заказов';
      });
  },
  selectors: {
    getProfileOrdersSelector: (state) => state.orders,
    getProfileLoadingSelector: (state) => state.isLoading,
    getProfileErrorSelector: (state) => state.error,
    getProfileOrderByNumberSelector: (state, number: number) =>
      state.orders.find((order) => order.number === number) ?? null,
  },
});

export const {
  getProfileOrdersSelector,
  getProfileLoadingSelector,
  getProfileErrorSelector,
  getProfileOrderByNumberSelector,
} = profileSlice.selectors;

export const profileReducer = profileSlice.reducer;
