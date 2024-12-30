import React, { memo, useMemo } from 'react';
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
import { Barchart } from '../components/Barchart';

const StaffCurrentOrder = memo(function StaffCurrentOrder({ order }: { order: OrderDetail }) {
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
});

export const StaffDashBoard = () => {
  // const { data: orders, isLoading } = useGetOrdersQuery();
  // const { data: deliveries, isLoading: isDeliveryLoading } = useGetDeliveriesQuery();

  return (
    <View style={styles.dashboardContainer}>
      {/* {orders && orders.length > 0 && <StaffCurrentOrder order={orders[0]} />} */}
      <View>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <Feather name='box' size={24} color='black' />
          <Text style={styles.sectionHeader}>Thống kê đơn hàng</Text>
        </View>
        <Barchart />
      </View>
      {/* delivery statistic */}
      <View>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <FontAwesome name='bicycle' size={24} color='black' />
          <Text style={styles.sectionHeader}>Thống kê chuyến đi</Text>
        </View>
        <Barchart />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
