import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@utils/baseQuery';
export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Orders', 'Reports', 'Deliveries'],
  endpoints: () => ({})
});
