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
