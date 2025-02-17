import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { useGlobalStyles } from 'app/shared/hooks/theme';
import { useGetNotificationsQuery } from 'app/features/notification/api/notification.api';
import { setUnReadNotificationCount } from 'app/shared/state/app.slice';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { StaffDashBoard } from './staff/StaffDashBoard';
import { StudentDashBoard } from './student/StudentDashBoard';
export const Dashboard = () => {
  const globalStyles = useGlobalStyles();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  // const [registerPushNoti] = useRegisterPushNotiMutation();
  // const { deviceToken } = useNotification();
  // useEffect(() => {
  //   if (deviceToken && auth.userInfo) {
  //     console.log({
  //       token: deviceToken,
  //       userId: auth.userInfo.id,
  //       platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
  //     });
  //     registerPushNoti({
  //       token: deviceToken,
  //       userId: auth.userInfo.id,
  //       platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
  //     })
  //       .then((res) => {
  //         console.log('Register push noti success', res);
  //       })
  //       .catch((err) => {
  //         console.log('Register push noti failed', err);
  //       });
  //   }
  // }, [deviceToken]);
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (notifications) {
      dispatch(setUnReadNotificationCount(notifications.unreadCount));
    }
  }, [notifications]);

  const onLayoutRootView = useCallback(async () => {
    await SplashScreenExpo.hideAsync();
  }, []);
  return (
    <View style={[globalStyles.background]} onLayout={onLayoutRootView}>
      {auth.userInfo?.role === 'STUDENT' ? <StudentDashBoard /> : <StaffDashBoard />}
    </View>
  );
};
