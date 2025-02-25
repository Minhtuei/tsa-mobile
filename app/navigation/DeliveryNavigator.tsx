import { Header } from 'app/shared/components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveryDetail from 'app/features/delivery/screens/DeliveryDetail';
import DeliveryList from 'app/features/delivery/screens/DeliveryList';
import StaffTrackOrder from 'app/features/delivery/staff/StaffTrackOrder';
import { DeliveryStackParamList } from 'app/shared/types/navigation';
import React from 'react';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export const DeliveryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />
      }}
      initialRouteName='DeliveryList'
    >
      <Stack.Screen
        name='DeliveryList'
        options={{
          title: 'Danh sách chuyến đi'
        }}
        component={DeliveryList}
      />
      <Stack.Screen
        name='DeliveryDetail'
        component={DeliveryDetail}
        options={{
          title: 'Chi tiết chuyến đi'
        }}
      />
      <Stack.Screen
        name='StaffTrackOrder'
        component={StaffTrackOrder}
        options={{
          title: 'Theo dõi đơn hàng'
        }}
      />
    </Stack.Navigator>
  );
};
