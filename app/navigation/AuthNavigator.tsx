import { useAppTheme } from 'app/shared/hooks/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigatorParamList } from 'app/shared/types/navigation';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { CreateAccount } from '../features/authentication/screens/CreateAccount';
import { ForgotPassword } from '../features/authentication/screens/ForgotPassword';
import { SignIn } from '../features/authentication/screens/SignIn';
import { SignUp } from '../features/authentication/screens/SignUp';
import { VerifyEmail } from '../features/authentication/screens/VerifyEmail';
const Stack = createNativeStackNavigator<AuthNavigatorParamList>();

export const AuthNavigator = () => {
  const theme = useAppTheme();
  return (
    <>
      <StatusBar
        style={theme.dark ? 'light' : 'dark'}
        backgroundColor={theme.colors.elevation.level1}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }} id='Auth' initialRouteName='SignIn'>
        <Stack.Screen name='SignIn' component={SignIn} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        <Stack.Screen name='VerifyEmail' component={VerifyEmail} />
        <Stack.Screen name='CreateAccount' component={CreateAccount} />
      </Stack.Navigator>
    </>
  );
};
