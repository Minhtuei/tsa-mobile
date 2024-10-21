import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Divider } from 'react-native-paper';
import { OrderDetail } from '@slices/order.slice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'app/types/navigation';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { formatVNDcurrency, formatUnixTimestamp, formatDate } from '@utils/format';

type OrderListProps = NativeStackScreenProps<OrderStackParamList, 'OrderList'> & {
  orders: OrderDetail[];
  loading: boolean;
};

const OrderItem: React.FC<{ order: OrderDetail }> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return 'red';
      case 'DELIVERED':
        return 'green';
      case 'IN_TRANSPORT':
        return 'blue';
      case 'PENDING':
        return 'orange';
      default:
        return 'red';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CANCELLED':
        return 'Đã hủy';
      case 'DELIVERED':
        return 'Đã giao';
      case 'IN_TRANSPORT':
        return 'Đang giao';
      case 'PENDING':
        return 'Chờ xử lý';
      default:
        return 'Bị từ chối';
    }
  };

  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: '25%' }}>
          <View style={styles.square}>
            <Feather name='box' size={42} color='red' />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 12, width: '75%' }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text
                style={{
                  color: 'green',
                  fontWeight: 'bold',
                  fontSize: 20
                }}
              >
                #{order.checkCode}
              </Text>
              <Text style={{ opacity: 0.4 }}>
                {formatDate(formatUnixTimestamp(order.deliveryDate))}
              </Text>
            </View>
            <Chip
              style={{
                backgroundColor: getStatusColor(order.latestStatus)
              }}
              textStyle={{
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {getStatusLabel(order.latestStatus)}
            </Chip>
          </View>
          <Divider />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text>{order.product}</Text>
              <Text>
                R.{order.room}, D.{order.building}, khu {order.dormitory}
              </Text>
              <Text style={{ fontWeight: 'bold' }}>{formatVNDcurrency(order.shippingFee)}</Text>
            </View>
            <EvilIcons name='pencil' size={32} color='blue' />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const OrderList: React.FC<OrderListProps> = ({ orders, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{orders.length} đơn hàng</Text>
      {loading ? (
        <ActivityIndicator size='large' color='#34A853' />
      ) : (
        <ScrollView>
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    alignSelf: 'center'
  }
});

export default OrderList;
