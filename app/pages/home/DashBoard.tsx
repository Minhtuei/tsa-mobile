import { DashboardHeader } from '@components/DashboardHeader';
import { QueryType } from '@components/QueryTypeBtnTab';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useGlobalStyles } from '@hooks/theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, NotificationStackParamList } from 'app/types/navigation';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Barchart } from './components/Barchart';
import { Piechart } from './components/Piechart';
import { StaffDashBoard } from './staff/StaffDashBoard';
import { StaffOrderCard } from './staff/StaffOrderCard';
import { Text } from 'react-native-paper';
import { useGetOrdersQuery } from '@services/order.service';
import { formatUnixTimestamp } from '@utils/format';
import { Feather } from '@expo/vector-icons';
import { useGetNotificationsQuery } from '@services/notification.service';
import { setReadNotifcation, setUnReadNotificationCount } from '@slices/app.slice';
export const Dashboard = (
  props: CompositeScreenProps<
    NativeStackScreenProps<HomeStackParamList, 'Dashboard'>,
    NativeStackScreenProps<NotificationStackParamList, 'NotificationList'>
  >
) => {
  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<QueryType>('week');
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
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true
  });
  useEffect(() => {
    if (notifications) {
      dispatch(setUnReadNotificationCount(notifications.unreadCount));
    }
  }, [notifications]);

  const getStartOfWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  const getEndOfWeek = (date: Date) => {
    const endOfWeek = new Date(date);
    const day = endOfWeek.getDay();
    const diff = endOfWeek.getDate() + (7 - day);
    endOfWeek.setDate(diff);
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  };

  const onLayoutRootView = useCallback(async () => {
    await SplashScreenExpo.hideAsync();
  }, []);
  const thisMonthOrder = useMemo(() => {
    return orders?.filter((order) => {
      const orderDate = new Date(formatUnixTimestamp(order.deliveryDate));
      const currentMonth = new Date().getMonth();
      const isStaff = order.shipperId === auth.userInfo?.id;
      return orderDate.getMonth() === currentMonth && isStaff;
    });
  }, [orders, auth]);

  const thisWeekOrder = useMemo(() => {
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());
    return orders?.filter((order) => {
      const orderDate = new Date(formatUnixTimestamp(order.deliveryDate));
      const isStaff = order.shipperId === auth.userInfo?.id;
      return orderDate >= startOfWeek && orderDate <= endOfWeek && isStaff;
    });
  }, [orders, auth]);

  return (
    <View style={[globalStyles.background]} onLayout={onLayoutRootView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <DashboardHeader />
        {auth.userInfo?.role === 'STUDENT' && (
          <View style={{ padding: 16 }}>
            <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
              <Feather name='box' size={24} color='black' />
              <Text style={styles.sectionHeader}>Thống kê đơn hàng</Text>
            </View>
            <View style={styles.rowWithGapLarge}>
              <StaffOrderCard
                numberOfOrders={thisMonthOrder?.length as number}
                color='#1ED7AA'
                title='Tháng này'
              />
              <StaffOrderCard
                numberOfOrders={thisWeekOrder?.length as number}
                color='#00BBD4'
                title='Tuần này'
              />
            </View>
            <Piechart />
          </View>
        )}
        {auth.userInfo?.role === 'STAFF' && <StaffDashBoard />}
      </ScrollView>
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
