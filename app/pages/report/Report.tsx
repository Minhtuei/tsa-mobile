import { Header } from '@components/Header';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, ReportStackParamList } from 'app/types/navigation';
import { CreateReport } from './CreateReport';
import { ReportDetail } from './ReportDetail';
import { ReportList } from './ReportList';

const Stack = createNativeStackNavigator<ReportStackParamList>();
export const Report = (props: NativeStackScreenProps<MainTabParamList, 'Report'>) => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen
        name='ReportList'
        component={ReportList}
        options={{ title: 'Danh sách khiếu nại' }}
      />
      <Stack.Screen
        name='ReportDetail'
        component={ReportDetail}
        options={{ title: 'Chi tiết khiếu nại' }}
      />
      <Stack.Screen
        name='CreateReport'
        component={CreateReport}
        options={{ title: 'Tạo khiếu nại' }}
      />
    </Stack.Navigator>
  );
};
