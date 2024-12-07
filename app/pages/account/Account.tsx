import { Header } from '@components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AccountStackParamList } from 'app/types/navigation';
import { ChangePassword } from './setting/ChangePassword';
import { ChangeTheme } from './setting/ChangeTheme';
import { Profile } from './setting/Profile';
import { SettingScreen } from './setting/SettingScreen';
import { AccountScreen } from './AccountScreen';
import { Report } from './report/Report';
const Stack = createNativeStackNavigator<AccountStackParamList>();
export const Account = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header
      }}
      initialRouteName='AccountScreen'
    >
      <Stack.Screen name='AccountScreen' component={AccountScreen} options={{ title: '' }} />
      <Stack.Screen name='Report' component={Report} options={{ title: 'Khiếu nại' }} />
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
