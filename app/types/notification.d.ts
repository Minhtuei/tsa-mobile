type PushNotiType = 'ENABLED' | 'DISABLED' | 'LOGOUT';
type RegiserPushNotification = {
  userId: string;
  token: string;
  platform: 'IOS' | 'ANDROID';
};

type UnRegiserPushNotification = {
  userId: string;
  token: string;
  type: PushNotiType;
};
type CheckPushNotification = Omit<RegiserPushNotification, 'platform'>;

type NormalNotificationType = 'ORDER' | 'REPORT' | 'DELIVERY' | 'SYSTEM';
type NormalNotification = {
  id: string;
  title: string;
  type: NormalNotificationType;
  content: string;
  createdAt: string;
  orderId: string | null;
  reportId: string | null;
  deliveryId: string | null;
  userId: string;
  isRead: boolean;
};
