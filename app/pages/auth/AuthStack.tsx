import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from 'app/types/navigation';
import { useAppTheme } from '@hooks/theme';
import { StatusBar } from 'expo-status-bar';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { VerifyEmail } from './VerifyEmail';
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
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      </Stack.Navigator>
    </>
  );
};
