import { Header } from 'app/shared/components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from 'app/shared/types/navigation';
import { Dashboard } from '../features/statistic/DashBoard';

const Stack = createNativeStackNavigator<HomeStackParamList>();
export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen name='Dashboard' component={Dashboard} />
    </Stack.Navigator>
  );
};
