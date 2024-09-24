import { Header } from '@components/Header';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  HomeStackParamList,
  MainTabParamList,
  OrderStackParamList,
} from 'app/types/navigation';
import { OrderList } from './OrderList';
import { OrderDetail } from './OrderDetail';

const Stack = createNativeStackNavigator<OrderStackParamList>();
export const Order = (
  props: NativeStackScreenProps<MainTabParamList, 'Order'>
) => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{ title: 'Danh sách đơn hàng' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: 'Chi tiết đơn hàng' }}
      />
    </Stack.Navigator>
  );
};
