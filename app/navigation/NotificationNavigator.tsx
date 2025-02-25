import { Header } from 'app/shared/components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationStackParamList } from 'app/shared/types/navigation';
import { NotificationList } from '../features/notification/NotificationList';

const Stack = createNativeStackNavigator<NotificationStackParamList>();
export const NotificationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ header: Header }}>
      <Stack.Screen
        name='NotificationList'
        component={NotificationList}
        options={{
          title: 'Thông báo'
        }}
      />
    </Stack.Navigator>
  );
};
