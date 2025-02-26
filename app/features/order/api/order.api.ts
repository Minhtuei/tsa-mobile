// services/order.service.ts
import { CreateOrderSchemaType } from 'app/features/order/schema/order.schema';
import { apiService } from '@services/api.service';
import { Order } from 'app/shared/types/order';
import { UpdateOrderStatus } from 'app/shared/state/order.slice';

const orderApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders'],
      transformResponse: (response: any) => {
        return response.results.sort((a: Order, b: Order) => {
          return Number(b.deliveryDate) - Number(a.deliveryDate);
        });
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
    }),
    updateOrderStatus: build.mutation<void, UpdateOrderStatus>({
      query: ({ orderId, ...rest }) => ({
        url: `orders/status/${orderId}`,
        method: 'PATCH',
        body: rest
      }),
      invalidatesTags: ['Orders', 'Deliveries']
    }),
    getCurrentOrder: build.query<Order, void>({
      query: () => 'orders/current'
    })
  })
});

export const {
  useGetOrdersQuery,
  useCreateOrdersMutation,
  useGetShippingFeeQuery,
  useUpdateOrderStatusMutation,
  useGetCurrentOrderQuery
} = orderApi;
