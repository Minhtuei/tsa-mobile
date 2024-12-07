import { Header } from '@components/Header';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, NotificationStackParamList } from 'app/types/navigation';
import { NotificationList } from './NotificationList';

const Stack = createNativeStackNavigator<NotificationStackParamList>();
export const Notification = (props: NativeStackScreenProps<MainTabParamList, 'Notification'>) => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen name='NotificationList' component={NotificationList} />
    </Stack.Navigator>
  );
};
