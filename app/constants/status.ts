export enum DeliveryStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  IN_TRANSPORT = 'IN_TRANSPORT'
}

export enum PaymentMethod {
  CREDIT = 'CREDIT',
  CASH = 'CASH',
  MOMO = 'MOMO'
}

export enum OrderCancelReason {
  'WRONG_ADDRESS' = 'WRONG_ADDRESS',
  'CAN_NOT_CONTACT' = 'CAN_NOT_CONTACT',
  'PAYMENT_ISSUE' = 'PAYMENT_ISSUE',
  'DAMAGED_PRODUCT' = 'DAMAGED_PRODUCT',
  'HEAVY_PRODUCT' = 'HEAVY_PRODUCT',
  'PERSONAL_REASON' = 'PERSONAL_REASON',
  'DAMEGED_VEHICLE' = 'DAMEGED_VEHICLE',
  'OTHER' = 'OTHER'
}

export enum EcommerceBrand {
  SHOPEE = 'Shopee',
  LAZADA = 'Lazada',
  TIKI = 'Tiki',
  TIKTOK = 'TikTok',
  SENDO = 'Sendo',
  BACHHOAXANH = 'Bách hoá xanh'
}
