import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { initialOrderList } from '@utils/mockData';
import { MainTabParamList, OrderStackParamList } from 'app/types/navigation';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { OrderListHeader } from './components/OrderListHeader';
import { OrderDetail } from './OrderDetail';
import { StaffOrderList } from './staff/StaffOrderList';
import { OrderList } from './OrderList';
import { useAppSelector } from '@hooks/redux';
import { Header } from '@components/Header';

const Stack = createNativeStackNavigator<OrderStackParamList>();

export const Order = (props: NativeStackScreenProps<MainTabParamList, 'Order'>) => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />
      }}
      initialRouteName='OrderList'
    >
      <Stack.Screen
        name='OrderList'
        component={OrderList} // Using the function to render
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
