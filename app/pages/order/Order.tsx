import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Header } from '@components/Header';
import { OrderListHeader } from './components/OrderListHeader';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList, OrderStackParamList } from 'app/types/navigation';
import { OrderList } from './OrderList';
import { OrderDetail } from './OrderDetail';
import { initialOrderList } from '@utils/mockData';

const Stack = createNativeStackNavigator<OrderStackParamList>();

export const Order = (props: NativeStackScreenProps<MainTabParamList, 'Order'>) => {
  const [filteredOrders, setFilteredOrders] = useState(initialOrderList.slice(0, 16));
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchText: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = initialOrderList
        .slice(0, 16)
        .filter((order) => order.checkCode.toLowerCase().includes(searchText.toLowerCase()));
      setFilteredOrders(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  const handleFilter = (status: boolean | null, date: Date | null, orderStatus: string | null) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = initialOrderList.slice(0, 16);

      if (status !== null) {
        filtered = filtered.filter((order) => order.isPaid === status);
      }

      if (date) {
        filtered = filtered.filter(
          (order) => new Date(order.deliveryDate).toDateString() === date.toDateString()
        );
      }

      if (orderStatus) {
        filtered = filtered.filter((order) => order.latestStatus === orderStatus);
      }

      setFilteredOrders(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <OrderListHeader onSearch={handleSearch} onFilter={handleFilter} />
      }}
    >
      <Stack.Screen
        name='OrderList'
        component={(props: any) => (
          <OrderList {...props} orders={filteredOrders} loading={loading} />
        )}
        options={{ title: 'Danh sách đơn hàng' }}
      />
      <Stack.Screen
        name='OrderDetail'
        component={OrderDetail}
        options={{ title: 'Chi tiết đơn hàng' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginTop: 20
  }
});

export default Order;
