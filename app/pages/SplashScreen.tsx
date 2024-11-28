import { SCREEN } from '@constants/screen';
import { darkTheme, lightTheme } from '@constants/style';
import { useAppDispatch } from '@hooks/redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setColorScheme } from '@slices/app.slice';
import { setToken, setUser } from '@slices/auth.slice';
import { RootStackParamList } from 'app/types/navigation';
import { Role } from 'app/types/role';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Image, ImageBackground } from 'react-native';
import { Surface } from 'react-native-paper';

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
    const user = await AsyncStorage.getItem('user');
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const onboarding = await AsyncStorage.getItem('onboarding');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: !onboarding ? 'Onboarding' : accessToken ? 'MainTab' : 'AuthStack'
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
      <ImageBackground
        source={require('../../assets/TSA_splash.png')}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    </>
  );
};
