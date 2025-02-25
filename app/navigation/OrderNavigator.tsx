import { Header } from 'app/shared/components/Header';
import { useAppSelector } from 'app/shared/hooks/redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderStackParamList } from 'app/shared/types/navigation';
import React from 'react';
import { OrderDetail } from '../features/order/orderDetail/OrderDetail';
import { OrderPayment } from '../features/order/orderDetail/OrderPayment';
import { StaffOrderDetail } from '../features/order/orderDetail/StaffOrderDetail';
import { CreateOrder } from '../features/order/screens/CreateOrder';
import { OrderList } from '../features/order/screens/OrderList';
import { TrackOrder } from '../features/order/screens/TrackOrder';

const Stack = createNativeStackNavigator<OrderStackParamList>();

export const OrderNavigator = () => {
  const auth = useAppSelector((state) => state.auth);
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
        component={auth.userInfo?.role === 'STUDENT' ? OrderDetail : StaffOrderDetail}
        options={{ title: 'Chi tiết đơn hàng' }}
      />
      <Stack.Screen
        name='CreateOrder'
        component={CreateOrder}
        options={{ title: 'Tạo đơn hàng' }}
      />
      <Stack.Screen
        name='TrackOrder'
        component={TrackOrder}
        options={{ title: 'Theo dõi đơn hàng' }}
      />
      <Stack.Screen
        name='OrderPayment'
        component={OrderPayment}
        options={{ title: 'Thanh toán đơn hàng' }}
      />
    </Stack.Navigator>
  );
};
