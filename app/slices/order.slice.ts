type PaymentMethod = 'CASH' | 'MOMO' | 'CREDIT';
export type OrderStatus =
  | 'CANCELED'
  | 'DELIVERED'
  | 'PENDING'
  | 'REJECTED'
  | 'IN_TRANSPORT'
  | 'REJECTED';

export const orderStatusMap = {
  'Đã giao': 'DELIVERED',
  'Đang giao': 'IN_TRANSPORT',
  'Đang chờ xử lý': 'PENDING',
  'Đã hủy': 'CANCELLED',
  'Đã từ chối': 'REJECTED',
  'Đã xác nhận': 'ACCEPTED'
};

interface OrderStatusHistory {
  id: string;
  orderId: string;
  reason?: string;
  time: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  checkCode: string;
  product: string;
  room: string;
  building: string;
  dormitory: string;
  deliveryDate: string;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  studentId?: string;
  adminId?: string;
  shipperId?: string;
  deliveryId?: string;
  ordinalNumber?: string;
  weight?: number;
  latestStatus: OrderStatus;
  phone?: string;
  createdTime?: string;
  historyTime: OrderStatusHistory[];
}

export interface OrderDetail extends Order {
  brand?: string;
}
