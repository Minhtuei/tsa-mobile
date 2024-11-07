import { CreateDeliverySchemaType, UpdateDeliverySchemaType } from '@validations/delivery.schema';
import { Delivery } from '@slices/delivery.slice';
import { apiService } from './api.service';

const deliveryService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getDeliveries: build.query<Delivery[], void>({
      query: () => 'deliveries',
      providesTags: ['Deliveries']
    }),
    getDelivery: build.query<Delivery, string>({
      query: (id) => `deliveries/${id}`,
      providesTags: (result, error, id) => [{ type: 'Deliveries', id }]
    }),
    updateDelivery: build.mutation<void, { id: string; data: UpdateDeliverySchemaType }>({
      query: ({ id, data }) => ({
        url: `deliveries/${id}`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deliveries', id }]
    }),
    updateDeliveryStatus: build.mutation<void, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `deliveries/status/${id}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Deliveries', id }]
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
