type OrderStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DELIVERED' | 'CANCELED' | 'IN_TRANSPORT';

export type PaymentMethod = 'CREDIT' | 'CASH' | 'MOMO';

type Order = {
  adminId: string | null;
  building: string;
  checkCode: string;
  deliveryDate: string;
  dormitory: string;
  historyTime: HistoryTime[];
  id: string;
  isPaid: boolean;
  latestStatus: OrderStatus;
  ordinalNumber: number | null;
  paymentMethod: PaymentMethod;
  phone: string | null;
  product: string;
  room: string;
  shipperId: string | null;
  shippingFee: number | null;
  studentId: string | null;
  weight: number;
  staffInfo?: {
    lastName: string | null;
    firstName: string | null;
    phoneNumber: string | null;
    photoUrl: string | null;
  };
  student?: any;
  brand?: string;
  remainingAmount?: number;
  finishedImage: string | null;
};

type HistoryTime = {
  id: string;
  orderId: string;
  reason: string | null;
  status: OrderStatus;
  time: string;
  canceledImage: string | null;
};

type OrderQueryDto = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isPaid?: boolean;
  startDate?: string;
  endDate?: string;
};
