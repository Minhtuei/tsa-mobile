import { apiService } from '@services/api.service';
const notificationApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getNotifications: build.query<
      {
        notifications: NormalNotification[];
        unreadCount: number;
      },
      void
    >({
      query: () => '/notifications'
    }),
    markAsRead: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'PATCH'
      })
    }),
    readAllNoti: build.mutation<void, void>({
      query: () => ({
        url: `/notifications/read-all`,
        method: 'PATCH'
      })
    }),
    registerPushNoti: build.mutation<void, RegiserPushNotification>({
      query: (body) => ({
        url: `/notifications/push/register`,
        method: 'POST',
        body
      })
    }),
    unRegisterPushNoti: build.mutation<void, UnRegiserPushNotification>({
      query: (body) => ({
        url: `/notifications/push/unregister`,
        method: 'POST',
        body
      })
    }),
    checkPushNoti: build.mutation<
      {
        pusNotiType: PushNotiType;
      },
      CheckPushNotification
    >({
      query: (body) => ({
        url: `/notifications/push/check`,
        method: 'POST',
        body
      })
    })
  })
});
export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useRegisterPushNotiMutation,
  useCheckPushNotiMutation,
  useUnRegisterPushNotiMutation,
  useReadAllNotiMutation
} = notificationApi;
