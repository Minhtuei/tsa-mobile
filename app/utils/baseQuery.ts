import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '@utils/store';
import { setToken } from '@slices/auth.slice';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
interface RefreshTokenRes {
  data: {
    token: string;
    refreshToken: string;
  };
}
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_SERVER_HOST + '/v1/',
  timeout: 20000,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.user.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      result = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: {
            refreshToken: (api.getState() as RootState).auth.user.refreshToken,
          },
        },
        api,
        extraOptions
      );
      if (result.data) {
        const { token, refreshToken } = (result.data as RefreshTokenRes).data;
        api.dispatch(setToken({ token, refreshToken }));
        release();
        return await baseQuery(args, api, extraOptions);
      } else {
        release();
        setTimeout(async () => {
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('refreshToken');
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('refreshToken');
          }
          api.dispatch(setToken({ token: '', refreshToken: '' }));
        }, 3000);
      }
    } else {
      await mutex.waitForUnlock();
      return await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
