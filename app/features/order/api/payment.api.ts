import { apiService } from '../../../shared/services/api.service';

const paymentService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createPayOSPayment: build.mutation<
      { paymentLink: PayOSCheckoutResponseDataType },
      PayOSCheckoutRequestType
    >({
      query: (body) => ({
        url: 'payment/payos',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Orders', 'Notification']
    })
  })
});

export const { useCreatePayOSPaymentMutation } = paymentService;
