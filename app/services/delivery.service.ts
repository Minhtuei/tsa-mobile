import { CreateDeliverySchemaType, UpdateDeliverySchemaType } from '@validations/delivery.schema';
import { Delivery, DetailDelivery } from '@slices/delivery.slice';
import { apiService } from './api.service';
import { DeliveryStatus } from 'app/types/delivery';

const deliveryService = apiService.injectEndpoints({
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
} = deliveryService;

export default deliveryService;
