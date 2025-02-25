import { Header } from 'app/shared/components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ReportDetail } from 'app/features/report/screens/ReportDetail';
import { ReportList } from 'app/features/report/screens/ReportList';
import { ReportStackParamList } from 'app/shared/types/navigation';
import { CreateReport } from '../features/report/screens/CreateReport';

const Stack = createNativeStackNavigator<ReportStackParamList>();
export const ReportNavigator = () => {
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
