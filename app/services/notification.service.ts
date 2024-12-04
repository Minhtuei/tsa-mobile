import { apiService } from './api.service';
const notificationService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getNotifications: build.query<NormalNotification[], void>({
      query: () => '/notifications'
    }),
    markAsRead: build.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
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
  useUnRegisterPushNotiMutation
} = notificationService;
