export enum NotificationFilterType {
  ALL = 'ALL',
  ORDER = 'ORDER',
  REPORT = 'REPORT',
  DELIVERY = 'DELIVERY',
  SYSTEM = 'SYSTEM'
}

export const NOTIFICATIONS: NormalNotification[] = [
  {
    id: '1',
    title: 'Thông báo hệ thống',
    type: 'SYSTEM',
    content: 'Hệ thống đã cập nhật phiên bản mới',
    createdAt: '2024-09-01T00:00:00Z',
    orderId: null,
    reportId: null,
    deliveryId: null,
    userId: '1',
    isRead: false
  },
  {
    id: '2',
    title: 'Đơn hàng',
    type: 'ORDER',
    content: 'Đơn hàng đã được giao thành công',
    createdAt: '2024-09-01T00:00:00Z',
    orderId: '#123456',
    reportId: null,
    deliveryId: null,
    userId: '1',
    isRead: true
  },
  {
    id: '3',
    title: 'Báo cáo',
    type: 'REPORT',
    content: 'Báo cáo đã được xử lý',
    createdAt: '2024-09-01T00:00:00Z',
    orderId: null,
    reportId: '#123456',
    deliveryId: null,
    userId: '1',
    isRead: false
  },
  {
    id: '4',
    title: 'Chuyến đi',
    type: 'DELIVERY',
    content: 'Chuyến đi đã hoàn thành',
    createdAt: '2024-09-01T00:00:00Z',
    orderId: null,
    reportId: null,
    deliveryId: '#123456',
    userId: '1',
    isRead: false
  }
];
