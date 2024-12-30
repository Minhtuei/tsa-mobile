import { CreateOrderSchemaType } from '@validations/order.schema';
import { apiService } from './api.service';
import { Order } from 'app/types/order';
import { OrderStatistics, UpdateOrderStatus } from '@slices/order.slice';
import { QueryType } from '@components/QueryTypeBtnTab';
const orderService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], void>({
      query: () => 'orders',
      providesTags: ['Orders'],
      transformResponse: (response: any) => {
        return response.results.sort((a: Order, b: Order) => {
          return Number(b.historyTime[0].time) - Number(a.historyTime[0].time);
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
    getStatistics: build.query<
      OrderStatistics, // Response type
      { type: QueryType } // Query argument type
    >({
      query: ({ type }) => ({
        url: 'orders/stats',
        params: { type }
      }),
      providesTags: ['Statistics']
    })
  })
});
export const {
  useGetOrdersQuery,
  useCreateOrdersMutation,
  useGetShippingFeeQuery,
  useUpdateOrderStatusMutation,
  useGetStatisticsQuery
} = orderService;
