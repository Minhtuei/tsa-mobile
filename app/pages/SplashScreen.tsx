import { SCREEN } from '@constants/screen';
import { darkTheme, lightTheme } from '@constants/style';
import { useAppDispatch } from '@hooks/redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setColorScheme } from '@slices/app.slice';
import { setLoading, setUser } from '@slices/auth.slice';
import { RootStackParamList } from 'app/types/navigation';
import { Role } from 'app/types/role';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance, Image } from 'react-native';
import { Surface } from 'react-native-paper';

export const SplashScreen = (
  props: NativeStackScreenProps<RootStackParamList, 'SplashScreen'>
) => {
  const THEME = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;

  const dispatch = useAppDispatch();
  const getData = async () => {
    let token: string | null = null;
    let refreshToken: string | null = null;
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      token = await SecureStore.getItemAsync('token');
      refreshToken = await SecureStore.getItemAsync('refreshToken');
    } else {
      token = await AsyncStorage.getItem('token');
      refreshToken = await AsyncStorage.getItem('refreshToken');
    }
    const name: string | null = await AsyncStorage.getItem('name');
    const role = (await AsyncStorage.getItem('role')) as Role | null;
    dispatch(
      setUser({
        name,
        token,
        refreshToken,
        role,
      })
    );
    const colorScheme = await AsyncStorage.getItem('colorScheme');
    if (colorScheme === 'dark' || colorScheme === 'light') {
      Appearance.setColorScheme(colorScheme);
    }
    dispatch(setColorScheme(colorScheme ?? 'system'));
    dispatch(setLoading(false));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const onboarding = await AsyncStorage.getItem('onboarding');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: onboarding ? 'Onboarding' : token ? 'MainTab' : 'AuthStack',
          },
        ],
      })
    );
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <StatusBar
        style={THEME.dark ? 'light' : 'dark'}
        backgroundColor={THEME.colors.background}
      />
      <Surface
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgb(39,204,150)',
        }}
      >
        <Image
          source={require('../../assets/logo.png')}
          resizeMethod="scale"
          resizeMode="contain"
          style={{
            width: SCREEN.width - 96,
          }}
        />
      </Surface>
    </>
  );
};
