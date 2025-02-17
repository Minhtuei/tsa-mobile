import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@utils/baseQuery';
export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Profile', 'Orders', 'Reports', 'Deliveries', 'Notification', 'Statistics'],
  endpoints: () => ({})
});
