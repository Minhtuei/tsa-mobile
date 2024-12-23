import { Header } from '@components/Header';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, OrderStackParamList } from 'app/types/navigation';
import React from 'react';
import { OrderDetail } from './OrderDetail';
import { StaffOrderDetail } from './staff/StaffOrderDetail';
import { OrderList } from './OrderList';
import { CreateOrder } from './CreateOrder';
import { useAppSelector } from '@hooks/redux';
import { TrackOrder } from './student/TrackOrder';
import { OrderPayment } from './OrderPayment';

const Stack = createNativeStackNavigator<OrderStackParamList>();

export const Order = (props: NativeStackScreenProps<MainTabParamList, 'Order'>) => {
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

export default Order;
