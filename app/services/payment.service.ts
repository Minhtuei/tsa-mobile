import { apiService } from './api.service';

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
      })
    })
  })
});

export const { useCreatePayOSPaymentMutation } = paymentService;
