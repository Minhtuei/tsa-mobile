import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from 'app/types/navigation';
import { useAppTheme } from '@hooks/theme';
import { StatusBar } from 'expo-status-bar';
import { SignIn } from './SignIn';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = (
  props: NativeStackScreenProps<RootStackParamList, 'AuthStack'>
) => {
  const theme = useAppTheme();
  return (
    <>
      <StatusBar
        style={theme.dark ? 'light' : 'dark'}
        backgroundColor={theme.colors.elevation.level1}
      />
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        id="Auth"
        initialRouteName="SignIn"
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </>
  );
};
