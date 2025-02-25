import { darkTheme, lightTheme } from 'app/shared/constants/style';
import { useAppDispatch } from 'app/shared/hooks/redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setColorScheme } from 'app/shared/state/app.slice';
import { setToken, setUser } from 'app/shared/state/auth.slice';
import { RootStackParamList } from 'app/shared/types/navigation';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreenExpo from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Surface } from 'react-native-paper';
SplashScreenExpo.preventAutoHideAsync();
export const SplashScreen = (props: NativeStackScreenProps<RootStackParamList, 'SplashScreen'>) => {
  const THEME = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;

  const dispatch = useAppDispatch();
  const getData = async () => {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      accessToken = await SecureStore.getItemAsync('accessToken');
      refreshToken = await SecureStore.getItemAsync('refreshToken');
    } else {
      accessToken = await AsyncStorage.getItem('accessToken');
      refreshToken = await AsyncStorage.getItem('refreshToken');
    }
    const user = await AsyncStorage.getItem('userInfo');
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
    dispatch(
      setToken({
        accessToken,
        refreshToken
      })
    );

    const colorScheme = await AsyncStorage.getItem('colorScheme');
    if (colorScheme === 'dark' || colorScheme === 'light') {
      Appearance.setColorScheme(colorScheme);
    }
    dispatch(setColorScheme(colorScheme ?? 'system'));

    const onboarding = await AsyncStorage.getItem('onboarding');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: !onboarding ? 'Onboarding' : accessToken && user ? 'MainTab' : 'AuthNavigator'
          }
        ]
      })
    );
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <StatusBar style={THEME.dark ? 'light' : 'dark'} backgroundColor={THEME.colors.background} />
      <Surface
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: THEME.colors.background
        }}
      >
        <></>
      </Surface>
    </>
  );
};
