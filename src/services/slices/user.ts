import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  type TRegisterData,
  type TLoginData,
} from '@utils/burger-api';
import { setCookie, deleteCookie } from '@utils/cookie';

import type { TUser } from '@utils-types';

export type TUserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
  isLoading: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  user: null,
  error: null,
  isLoading: false,
};

// асинхронные экшены

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Синхронный экшен для отметки, что проверка авторизации завершена
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // регистрация
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error?.message ?? 'Ошибка регистрации';
      })
      // вход
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.error = action.error?.message ?? 'Ошибка входа';
      })
      // получение пользователя
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.user = null;
        state.error = null;
      })
      // обновление пользователя
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error?.message ?? 'Ошибка обновления данных';
      })
      // выход
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthChecked = true;
        state.user = null;
        state.error = null;
      })

      // восстановление пароля
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка восстановления пароля';
      })

      // сброс пароля
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка сброса пароля';
      });
  },
  selectors: {
    getUserSelector: (state) => state.user,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked,
    getUserLoadingSelector: (state) => state.isLoading,
    getUserErrorSelector: (state) => state.error,
  },
});

export const {
  getUserSelector,
  getIsAuthCheckedSelector,
  getUserLoadingSelector,
  getUserErrorSelector,
} = userSlice.selectors;

export const { authChecked, clearError } = userSlice.actions;
export const userReducer = userSlice.reducer;
