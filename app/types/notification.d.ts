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
