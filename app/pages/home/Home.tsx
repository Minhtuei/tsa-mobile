import { Header } from '@components/Header';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList } from 'app/types/navigation';
import { Dashboard } from './DashBoard';

const Stack = createNativeStackNavigator<HomeStackParamList>();
export const Home = (
  props: NativeStackScreenProps<MainTabParamList, 'Home'>
) => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
};
