import { apiService } from './api.service';

const orderService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders']
    })
  })
});
export const { useGetOrdersQuery } = orderService;
