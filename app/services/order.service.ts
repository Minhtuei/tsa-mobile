import { CreateOrderSchemaType } from '@validations/order.schema';
import { apiService } from './api.service';
import { Order } from 'app/types/order';
import { getShippingFee } from '@utils/shippingFee';

const orderService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders'],
      transformResponse: (response: any) => {
        return response.results;
      }
    }),
    getShippingFee: build.query<
      { shippingFee: number },
      Pick<Order, 'dormitory' | 'building' | 'weight' | 'room'>
    >({
      query: (params) => ({
        url: 'orders/shipping-fee',
        params: params
      })
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
export const { useGetOrdersQuery, useCreateOrdersMutation, useGetShippingFeeQuery } = orderService;
