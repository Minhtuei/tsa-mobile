import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from 'app/shared/state/auth.slice';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
export const saveUserInfo = async (userInfo: UserInfo | null) => {
  console.log('userInfo', userInfo);
  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
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
