import { Header } from '@components/Header';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeliveryStackParamList, MainTabParamList } from 'app/types/navigation';
import React from 'react';
import { StyleSheet } from 'react-native';
import DeliveryDetail from './DeliveryDetail';
import DeliveryList from './DeliveryList';
import StaffTrackOrder from './staff/StaffTrackOrder';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export const Delivery = (props: NativeStackScreenProps<MainTabParamList, 'Delivery'>) => {
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

export default Delivery;
