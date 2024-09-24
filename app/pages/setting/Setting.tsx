import { Header } from '@components/Header';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingStackParamList } from 'app/types/navigation';
import { ChangeTheme } from './ChangeTheme';
import { ChangePassword } from './ChangePassword';
import { Profile } from './Profile';
import { SettingScreen } from './SettingScreen';

const Stack = createNativeStackNavigator<SettingStackParamList>();
export const Setting = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: Header }}
      initialRouteName="SettingScreen"
    >
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ title: 'Cài đặt' }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Thông tin cá nhân' }}
      />
      <Stack.Screen
        name="ChangeTheme"
        component={ChangeTheme}
        options={{ title: 'Chế độ màu' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: 'Đổi mật khẩu' }}
      />
    </Stack.Navigator>
  );
};
