import { apiService } from './api.service';

const paymentService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createPayOSPayment: build.mutation<{ checkoutUrl: string }, PayOSCheckoutRequestType>({
      query: (body) => ({
        url: 'payment/payos',
        method: 'POST',
        body
      })
    })
  })
});

export const { useCreatePayOSPaymentMutation } = paymentService;
