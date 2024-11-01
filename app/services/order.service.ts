import { CreateOrderSchemaType } from '@validations/order.schema';
import { apiService } from './api.service';

const orderService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders']
    }),
    createOrders: build.mutation<
      void,
      Omit<CreateOrderSchemaType, 'time' | 'weight'> & { weight: number }
    >({
      query: (order) => ({
        url: 'orders',
        method: 'POST',
        body: order
      }),
      invalidatesTags: ['Orders']
    })
  })
});
export const { useGetOrdersQuery, useCreateOrdersMutation } = orderService;
