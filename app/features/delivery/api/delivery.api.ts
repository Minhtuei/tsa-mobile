import { apiService } from '@services/api.service';
import { UpdateDeliverySchemaType } from 'app/features/delivery/schema/delivery.schema';
import { Delivery, DetailDelivery } from 'app/shared/state/delivery.slice';
import { DeliveryStatus } from 'app/shared/types/delivery';

export const deliveryApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getDeliveries: build.query<Delivery[], void>({
      query: () => 'deliveries',
      providesTags: ['Deliveries'],
      transformResponse: (response: any) => {
        return response.sort((a: Delivery, b: Delivery) => {
          return Number(b.createdAt) - Number(a.createdAt);
        });
      }
    }),
    getDelivery: build.query<DetailDelivery, string>({
      query: (id) => `deliveries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Deliveries', id }],
      transformResponse: (response: any) => {
        return {
          ...response,
          orders: response.orders.sort((a: any, b: any) => {
            return Number(a.deliveryDate) - Number(b.deliveryDate);
          })
        };
      }
    }),
    updateDelivery: build.mutation<void, { id: string; data: UpdateDeliverySchemaType }>({
      query: ({ id, data }) => ({
        url: `deliveries/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deliveries', id }]
    }),
    updateDeliveryStatus: build.mutation<
      void,
      { id: string; status: Omit<DeliveryStatus, 'PENDING'> }
    >({
      query: ({ id, status }) => ({
        url: `deliveries/status/${id}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: [{ type: 'Deliveries' }]
    })
  })
});

export const {
  useGetDeliveriesQuery,
  useGetDeliveryQuery,
  useUpdateDeliveryMutation,
  useUpdateDeliveryStatusMutation
} = deliveryApi;
