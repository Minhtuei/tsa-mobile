import React, { useMemo } from 'react';
import { Text, Card, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { OrderDetail } from '@slices/order.slice';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { StaffOrderCard } from './StaffOrderCard';
import { StaffDeliveryCard } from './StaffDeliveryCard';
import { useGetOrdersQuery } from '@services/order.service';
import { useGetDeliveriesQuery } from '@services/delivery.service';
import { formatUnixTimestamp } from '@utils/format';
import { useAppSelector } from '@hooks/redux';

const StaffCurrentOrder: React.FC<{ order: OrderDetail }> = ({ order }) => {
  return (
    <View>
      <Text style={styles.header}>Đơn hàng hiện tại</Text>
      <Card>
        <Card.Content style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <View style={styles.rowWithGap}>
              <Text>Mã ĐH:</Text>
              <Text style={styles.boldText}>#{order.checkCode}</Text>
            </View>
            <View style={styles.rowWithGapSmall}>
              <View style={styles.circle}></View>
              <Text>Đang vận chuyển</Text>
            </View>
          </View>
          <View style={styles.rowWithGap}>
            <Ionicons name='location-sharp' size={24} color='black' />
            <Text>
              Phòng {order.room}, Tòa {order.building}, KTX Khu {order.dormitory}
            </Text>
          </View>
          <View style={styles.rowButtonGroup}>
            <Button mode='outlined' style={{ backgroundColor: 'white' }}>
              Chi tiết
            </Button>
            <Button
              icon={() => <MaterialCommunityIcons name='directions' size={24} color='white' />}
              mode='contained'
            >
              Đường đi
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export const StaffDashBoard = () => {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const { data: deliveries, isLoading: isDeliveryLoading } = useGetDeliveriesQuery();
  const auth = useAppSelector((state) => state.auth);

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

  const thisMonthDelivery = useMemo(() => {
    return deliveries?.filter((delivery) => {
      const deliveryDate = new Date(formatUnixTimestamp(delivery.createdAt));
      const currentMonth = new Date().getMonth();
      const isStaff = delivery.staffId === auth.userInfo?.id;
      return deliveryDate.getMonth() === currentMonth && isStaff;
    });
  }, [deliveries, auth]);

  const thisWeekDelivery = useMemo(() => {
    const startOfWeek = getStartOfWeek(new Date());
    const endOfWeek = getEndOfWeek(new Date());
    return deliveries?.filter((delivery) => {
      const deliveryDate = new Date(formatUnixTimestamp(delivery.createdAt));
      const isStaff = delivery.staffId === auth.userInfo?.id;
      return deliveryDate >= startOfWeek && deliveryDate <= endOfWeek && isStaff;
    });
  }, [deliveries, auth]);

  return (
    <View style={styles.dashboardContainer}>
      {orders && orders.length > 0 && <StaffCurrentOrder order={orders[0]} />}
      <View>
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
      </View>
      {/* delivery statistic */}
      <View>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <FontAwesome name='bicycle' size={24} color='black' />
          <Text style={styles.sectionHeader}>Thống kê chuyến đi</Text>
        </View>
        <View style={styles.columnWithGap}>
          <StaffDeliveryCard
            numberOfDeliveries={thisMonthDelivery?.length as number}
            title='Tháng này'
            color='#34A853'
          />
          <StaffDeliveryCard
            numberOfDeliveries={thisWeekDelivery?.length as number}
            title='Tuần này'
            color='#FFA900'
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  dashboardContainer: {
    paddingHorizontal: 24,
    flexDirection: 'column',
    gap: 16
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  cardContent: {
    flexDirection: 'column',
    gap: 20
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
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

export default StaffDashBoard;
