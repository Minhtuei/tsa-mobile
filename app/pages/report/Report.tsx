import { Header } from '@components/Header';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  HomeStackParamList,
  MainTabParamList,
  OrderStackParamList,
  ReportStackParamList,
} from 'app/types/navigation';
import { ReportList } from './ReportList';
import { ReportDetail } from './ReportDetail';

const Stack = createNativeStackNavigator<ReportStackParamList>();
export const Report = (
  props: NativeStackScreenProps<MainTabParamList, 'Report'>
) => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen
        name="ReportList"
        component={ReportList}
        options={{ title: 'Danh sách đơn hàng' }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={{ title: 'Chi tiết đơn hàng' }}
      />
    </Stack.Navigator>
  );
};
