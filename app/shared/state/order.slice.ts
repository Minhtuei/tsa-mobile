import { OrderCancelReason, OrderStatus } from 'app/shared/constants/status';

type PaymentMethod = 'CASH' | 'MOMO' | 'CREDIT';

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
  canceledImage?: string;
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
  finishedImage?: string;
}

export interface OrderDetail extends Order {
  brand?: string;
}

export interface UpdateOrderStatus {
  orderId: string;
  status: OrderStatus;
  finishedImage?: string;
  canceledImage?: string;
  reason?: string;
  distance?: number;
  cancelReasonType?: OrderCancelReason;
}

export interface OrderStatistics {
  totalOrdersLastMonth?: number;
  totalOrdersLastWeek?: number;
  brandPercentages: {
    brand: string;
    count: number;
    percentage: string;
  }[];
  totalShippingFee?: number;
  totalOrders?: number;
}
