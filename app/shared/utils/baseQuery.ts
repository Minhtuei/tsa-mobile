import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import { RootState } from '@slices/store';
import { setToken } from 'app/shared/state/auth.slice';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
interface RefreshTokenRes {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}
const mutex = new Mutex();
console.log('process.env.EXPO_PUBLIC_SERVER_HOST', process.env.EXPO_PUBLIC_SERVER_HOST);
const baseQuery = fetchBaseQuery({
  // baseUrl: process.env.EXPO_PUBLIC_SERVER_HOST,
  baseUrl: 'https://rbp8zpmp-8000.asse.devtunnels.ms/api/',
  timeout: 20000,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (
    result.error &&
    result.error.status === 401 &&
    (result.error.data as any)?.code === 'INVALID_ACCESS_TOKEN'
  ) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      result = await baseQuery(
        {
          url: 'auth/refresh',
          method: 'POST',
          body: {
            refreshToken: (api.getState() as RootState).auth.refreshToken
          }
        },
        api,
        extraOptions
      );
      if (result.data) {
        const { accessToken, refreshToken } = (result as RefreshTokenRes).data;
        api.dispatch(setToken({ accessToken, refreshToken }));
        release();
        return await baseQuery(args, api, extraOptions);
      } else {
        release();
        setTimeout(async () => {
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
          } else {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
          }
          api.dispatch(setToken({ accessToken: null, refreshToken: null }));
        }, 3000);
      }
    } else {
      await mutex.waitForUnlock();
      return await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
