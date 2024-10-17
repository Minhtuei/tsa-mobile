import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'expo-modules-core';
import { removeUser } from '@slices/auth.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Divider, Portal, Surface, Switch, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingStackParamList } from '../../types/navigation';
import IconModal from '@components/IconModal';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';

import SettingButton from '@components/SettingButton';
import { CommonActions } from '@react-navigation/native';

// Dùng làm điều kiện hiển thị tính năng 'Xoá Tài Khoản' --> chỉ hiển thị cho Apple review
const APPLE_DEMO_ACCOUNT_NAME = 'Nguyen Van A'; // Account name của tài khoản Demo cung cấp cho Apple
export const SettingScreen = (
  props: NativeStackScreenProps<SettingStackParamList, 'SettingScreen'>
) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  // Show error then log out
  const [logOutErr, setlogOutErr] = useState('');
  // Show error but doesn't log out
  const [unregisterErr, setUnregisterErr] = useState('');
  const [notification, setNotification] = useState(false);
  const [switchNotificationLoading, setSwitchNotificationLoading] = useState(false);
  const [logOutLoading, setLogOutLoading] = useState(false);

  const signOut = async () => {
    await clearStorage();
    props.navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'AuthStack' }] }));
  };

  const clearStorage = async () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      await SecureStore.deleteItemAsync('token');
    } else {
      await AsyncStorage.removeItem('token');
    }
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('email');
    dispatch(removeUser());
  };

  const globalStyles = useGlobalStyles();

  return (
    <View style={globalStyles.fullScreen}>
      <SettingButton
        text='Hồ sơ'
        icon='account'
        onPress={() => {
          props.navigation.navigate('Profile');
        }}
      />
      <Divider />
      <SettingButton
        text='Chế độ màu'
        icon='circle-half-full'
        onPress={() => {
          props.navigation.navigate('ChangeTheme');
        }}
      />
      <Divider />
      <SettingButton
        text='Đổi mật khẩu'
        icon='lock-reset'
        onPress={() => {
          props.navigation.navigate('ChangePassword');
        }}
      />
      <Divider />
      {/* <SettingButton
        text="Trung tâm trợ giúp"
        icon="help-circle"
        onPress={() => {
          Linking.openURL('https://loathanhtoan.com/');
        }}
      /> */}

      {/* {auth.user.name === APPLE_DEMO_ACCOUNT_NAME && (
        <>
          <Divider></Divider>
          <SettingButton
            text="Yêu cầu xoá tài khoản"
            icon="delete"
            onPress={() => {
              props.navigation.navigate('DeleteAccount');
            }}
          />
        </>
      )}

      <Divider /> */}
      <SettingButton
        text='Đăng xuất'
        icon='logout'
        disabled={logOutLoading}
        loading={logOutLoading}
        onPress={signOut}
      />
      <Portal>
        <IconModal
          variant='warning'
          message={unregisterErr}
          onDismiss={() => setUnregisterErr('')}
        />
        <IconModal
          variant='warning'
          message={logOutErr}
          onDismiss={() => {
            setlogOutErr('');
            clearStorage();
          }}
        />
      </Portal>
    </View>
  );
};
