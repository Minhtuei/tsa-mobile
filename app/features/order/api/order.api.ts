// services/order.service.ts
import { CreateOrderSchemaType } from 'app/features/order/schema/order.schema';
import { apiService } from '@services/api.service';
import { Order } from 'app/shared/types/order';
import { UpdateOrderStatus } from 'app/shared/state/order.slice';
import { OrderQueryDto } from 'app/shared/types/order';

const orderApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<
      {
        totalPages: number;
        totalElements: number;
        results: Order[];
      },
      Partial<OrderQueryDto>
    >({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.page !== undefined) query.append('page', String(params.page));
        if (params?.size !== undefined) query.append('size', String(params.size));
        if (params?.search) query.append('search', params.search);
        if (params?.status) query.append('status', params.status);
        if (params?.isPaid !== undefined) query.append('isPaid', String(params.isPaid));
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.startDate) query.append('startDate', params.startDate);
        if (params?.endDate) query.append('endDate', params.endDate);

        return `orders?${query.toString()}`;
      },
      providesTags: ['Orders']
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
