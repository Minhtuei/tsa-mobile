import React, { useMemo } from 'react';
import { Text, Card, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { OrderDetail } from '@slices/order.slice';
import { initialDeliveryList, initialOrderList } from '@utils/mockData';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StaffOrderCard } from './StaffOrderCard';
import { StaffDeliveryCard } from './StaffDeliveryCard';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

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
  const thisMonthOrder = useMemo(() => {
    return initialOrderList;
  }, [initialOrderList]);
  const thisWeekOrder = useMemo(() => {
    return initialOrderList;
  }, [initialOrderList]);

  const thisMontDelivery = useMemo(() => {
    return initialDeliveryList;
  }, [initialDeliveryList]);
  const thisWeekDelivery = useMemo(() => {
    return initialDeliveryList;
  }, [initialDeliveryList]);
  return (
    <View style={styles.dashboardContainer}>
      <StaffCurrentOrder order={initialOrderList[0]} />
      {/* order statistic */}
      <View>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <Feather name='box' size={24} color='black' />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20
            }}
          >
            Thống kê đơn hàng
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            gap: 16
          }}
        >
          <StaffOrderCard
            numberOfOrders={thisMonthOrder.length}
            color='#1ED7AA'
            title='Tháng này'
          />
          <StaffOrderCard numberOfOrders={thisWeekOrder.length} color='#00BBD4' title='Tuần này' />
        </View>
      </View>
      {/* delivery statistic */}
      <View>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <FontAwesome name='bicycle' size={24} color='black' />
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20
            }}
          >
            Thống kê chuyến đi
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            gap: 16
          }}
        >
          <StaffDeliveryCard
            numberOfDeliveries={thisMontDelivery.length}
            title='Tháng này'
            color='#34A853'
          />
          <StaffDeliveryCard
            numberOfDeliveries={thisWeekDelivery.length}
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
  boldText: {
    fontWeight: 'bold'
  },
  circle: {
    width: 12,
    height: 12, // Adjust the size as needed
    borderRadius: 10, // Half of the width and height to make it a circle
    backgroundColor: 'orange'
  }
});

export default StaffDashBoard;
