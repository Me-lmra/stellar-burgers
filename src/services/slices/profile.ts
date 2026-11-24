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

export const fetchProfileOrders = createAsyncThunk('profile/fetchOrders', async () => {
  return await getOrdersApi();
});

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
});

export const profileReducer = profileSlice.reducer;
