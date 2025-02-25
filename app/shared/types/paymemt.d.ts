type PayOSCheckoutResponseDataType = {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number;
  currency: string;
  paymentLinkId: string;
  status: string;
  expiredAt?: number;
  checkoutUrl: string;
  qrCode: string;
};

type PayOSCheckoutRequestType = {
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  extraData?: string;
  orderId: string;
};
