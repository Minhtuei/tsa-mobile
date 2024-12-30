import { DashboardHeader } from '@components/DashboardHeader';
import { QueryType } from '@components/QueryTypeBtnTab';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useGlobalStyles } from '@hooks/theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, NotificationStackParamList } from 'app/types/navigation';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Barchart } from './components/Barchart';
import { Piechart } from './components/Piechart.1';
import { StaffDashBoard } from './staff/StaffDashBoard';
import { StaffOrderCard } from './staff/StaffOrderCard';
import { Text } from 'react-native-paper';
import { useGetOrdersQuery, useGetStatisticsQuery } from '@services/order.service';
import { formatUnixTimestamp } from '@utils/format';
import { Feather } from '@expo/vector-icons';
import { useGetNotificationsQuery } from '@services/notification.service';
import { setReadNotifcation, setUnReadNotificationCount } from '@slices/app.slice';
import { StudentDashBoard } from './StudentDashBoard';
export const Dashboard = (
  props: CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, 'Dashboard'>,
    NativeStackScreenProps<NotificationStackParamList, 'NotificationList'>
  >
) => {
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
      {auth.userInfo?.role === 'STUDENT' ? (
        <StudentDashBoard />
      ) : (
        <ScrollView
          // refreshControl={
          //   <RefreshControl
          //     refreshing={isGetOrderStatisticFetching}
          //     onRefresh={() => {
          //       refetchOrderStatistic();
          //     }}
          //   />
          // }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
          stickyHeaderIndices={[0]}
        >
          <StaffDashBoard />
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  rowWithGap: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  rowWithGapSmall: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center'
  },
  rowButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%'
  },
  rowWithGapGreen: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    color: 'green'
  },
  rowWithGapLarge: {
    flexDirection: 'row',
    width: '100%',
    gap: 16
  },
  columnWithGap: {
    flexDirection: 'column',
    gap: 16
  },
  boldText: {
    fontWeight: 'bold'
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'orange'
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
