import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Divider } from 'react-native-paper';
import { OrderDetail } from 'app/shared/state/order.slice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'app/shared/types/navigation';
import Feather from '@expo/vector-icons/Feather';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { formatVNDcurrency, formatUnixTimestamp, formatDate } from 'app/shared/utils/format';
import { OrderListHeader } from '../components/OrderListHeader';
import { useGetOrdersQuery } from 'app/features/order/api/order.api';
import { useAppSelector } from 'app/shared/hooks/redux';
import { getStatusRender } from 'app/shared/utils/order';

const OrderItem: React.FC<{ order: OrderDetail; onPress: () => void }> = ({ order, onPress }) => {
  const statusRender = getStatusRender(order.latestStatus);

  return (
    <Card style={{ marginBottom: 12 }} onPress={onPress}>
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
                backgroundColor: statusRender.color
              }}
              textStyle={{
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {statusRender.label}
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

export const StaffOrderList = (props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>) => {
  const auth = useAppSelector((state) => state.auth);
  const { data: orders, isLoading } = useGetOrdersQuery();
  const staffOrders = useMemo(() => {
    return orders?.filter((order) => order.shipperId === auth.userInfo?.id);
  }, [orders]);
  const [filteredOrders, setFilteredOrders] = useState(staffOrders?.slice(0, 16));
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchText: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = staffOrders
        ?.slice(0, 16)
        .filter((order) => order.checkCode.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredOrders(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  const handleFilter = (status: boolean | null, date: Date | null, orderStatus: string | null) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = staffOrders?.slice(0, 16);

      if (status !== null) {
        filtered = filtered?.filter((order) => order.isPaid === status);
      }

      if (date) {
        filtered = filtered?.filter(
          (order) => new Date(order.deliveryDate).toDateString() === date.toDateString()
        );
      }

      if (orderStatus) {
        filtered = filtered?.filter((order) => order.latestStatus === orderStatus);
      }

      setFilteredOrders(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  return (
    <>
      <OrderListHeader onSearch={handleSearch} onFilter={handleFilter} />
      <View style={styles.container}>
        <Text style={styles.header}>{filteredOrders?.length} đơn hàng</Text>
        {loading ? (
          <ActivityIndicator size='large' color='#34A853' />
        ) : (
          <ScrollView>
            {filteredOrders?.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onPress={() => props.navigation.navigate('OrderDetail', { order })}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </>
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
