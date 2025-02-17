import { OrderDetail } from './order.slice';
import { DeliveryStatus } from 'app/shared/types/delivery';
export interface Delivery {
  id: string;
  createdAt: string;
  acceptedAt?: string;
  deliveryAt?: string;
  limitTime: number;
  delayTime?: number;
  DeliveryStatusHistory: {
    status: DeliveryStatus;
    time: string;
    reason: string | null;
  }[];
  staffId: string;
  numberOrder: number;
  latestStatus: DeliveryStatus;
}
export interface DeliverOrderDetail extends OrderDetail {
  studentInfo: {
    lastName: string;
    firstName: string;
    phoneNumber: string;
    photoUrl: string;
  };
}
export interface DetailDelivery extends Delivery {
  orders: DeliverOrderDetail[];
}

export const deliveryStatusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã chấp nhận': 'ACCEPTED',
  'Đã hoàn thành': 'FINISHED',
  'Đã hủy': 'CANCELED'
};
