import { Header } from 'app/shared/components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from 'app/shared/types/navigation';
import { AccountScreen } from '../features/account/screens/AccountScreen';
import { ChangePassword } from '../features/account/setting/ChangePassword';
import { ChangeTheme } from '../features/account/setting/ChangeTheme';
import { Profile } from '../features/account/setting/Profile';
import { SettingScreen } from '../features/account/screens/SettingScreen';
import { ReportNavigator } from 'app/navigation/ReportNavigator';
const Stack = createNativeStackNavigator<AccountStackParamList>();
export const AccountNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header
      }}
      initialRouteName='AccountScreen'
    >
      <Stack.Screen name='AccountScreen' component={AccountScreen} options={{ title: '' }} />
      <Stack.Screen name='Report' component={ReportNavigator} options={{ title: 'Khiếu nại' }} />
      <Stack.Screen name='SettingScreen' component={SettingScreen} options={{ title: 'Cài đặt' }} />
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={{ title: 'Thay đổi thông tin cá nhân' }}
      />
      <Stack.Screen name='ChangeTheme' component={ChangeTheme} options={{ title: 'Chế độ màu' }} />
      <Stack.Screen
        name='ChangePassword'
        component={ChangePassword}
        options={{ title: 'Đổi mật khẩu' }}
      />
    </Stack.Navigator>
  );
};
