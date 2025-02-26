import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from 'app/shared/state/auth.slice';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
export const saveUserInfo = async (userInfo: UserInfo | null) => {
  console.log('userInfo', userInfo);
  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = async () => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};
export const getToken = async () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return { accessToken, refreshToken };
  } else {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    return { accessToken, refreshToken };
  }
};
export const saveToken = async (accessToken: string | null, refreshToken: string | null) => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    await SecureStore.setItemAsync('accessToken', accessToken ?? '');
    await SecureStore.setItemAsync('refreshToken', refreshToken ?? '');
  } else {
    await AsyncStorage.setItem('accessToken', accessToken ?? '');
    await AsyncStorage.setItem('refreshToken', refreshToken ?? '');
  }
};

export const saveLocation = async (location: { latitude: number; longitude: number }) => {
  await AsyncStorage.setItem('location', JSON.stringify(location));
};

export const getLocation = async () => {
  const location = await AsyncStorage.getItem('location');
  return location ? JSON.parse(location) : null;
};

export const saveCurrentOrder = async (orderId: string) => {
  await AsyncStorage.setItem('currentOrder', orderId);
};

export const getCurrentOrder = async () => {
  return await AsyncStorage.getItem('currentOrder');
};
