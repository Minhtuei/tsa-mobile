import { apiService } from './api.service';

const orderService = apiService.injectEndpoints({
  overrideExisting: false,
  endpoints: (build) => ({
    getOrders: build.query({
      query: () => 'orders',
      providesTags: ['Orders']
    })
  })
});
export const { useGetOrdersQuery } = orderService;
