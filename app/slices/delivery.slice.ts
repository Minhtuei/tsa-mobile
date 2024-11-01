import { OrderDetail } from './order.slice';
import { DeliveryStatus } from 'app/types/delivery';
export interface Delivery {
  id: string;
  createdAt: string;
  acceptedAt?: string;
  deliveryAt?: string;
  limitTime: number;
  delayTime?: number;
  status: DeliveryStatus;
  orders: OrderDetail[];
  staffId: string;
}

export const deliveryStatusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã chấp nhận': 'ACCEPTED',
  'Đã hoàn thành': 'FINISHED',
  'Đã hủy': 'CANCELED'
};
