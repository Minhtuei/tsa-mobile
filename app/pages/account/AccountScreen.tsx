import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'expo-modules-core';
import { removeUser } from '@slices/auth.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Divider, Portal, Surface, Switch, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IconModal from '@components/IconModal';
import { useEffect, useState } from 'react';
import { Image, Linking, View } from 'react-native';

import SettingButton from '@components/SettingButton';
import { useLogoutMutation } from '@services/auth.service';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AccountStackParamList } from 'app/types/navigation';
// Dùng làm điều kiện hiển thị tính năng 'Xoá Tài Khoản' --> chỉ hiển thị cho Apple review
const APPLE_DEMO_ACCOUNT_NAME = 'Nguyen Van A'; // Account name của tài khoản Demo cung cấp cho Apple
export const AccountScreen = (
  props: NativeStackScreenProps<AccountStackParamList, 'AccountScreen'>
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
  const [logOut, { isLoading: logOutLoading }] = useLogoutMutation();

  const signOut = async () => {
    if (!auth.refreshToken) {
      return;
    }
    logOut({ refreshToken: auth.refreshToken })
      .unwrap()
      .then(() => {
        clearStorage();
      })
      .catch((err: any) => {
        setlogOutErr(err.data.message);
      });
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
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: theme.colors.primary,
            width: 100,
            height: 100,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {auth.userInfo?.photoUrl ? (
            <Image
              source={{ uri: auth.userInfo.photoUrl }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMethod='resize'
              resizeMode='cover'
            />
          ) : (
            <FontAwesome name='user' size={50} color='white' />
          )}
        </View>
        {auth.userInfo && (
          <>
            <Text style={[globalStyles.text, { marginTop: 16, fontSize: 20 }]}>
              {auth.userInfo.lastName} {auth.userInfo.firstName}
            </Text>
            <Text
              style={[
                globalStyles.text,
                { fontSize: 14, fontStyle: 'italic', color: theme.colors.secondary }
              ]}
            >
              {auth.userInfo.role === 'STUDENT' ? 'Sinh viên' : 'Nhân viên'}
            </Text>
          </>
        )}
      </View>
      {auth.userInfo && (
        <>
          <SettingButton
            text='Số điện thoại'
            icon='phone'
            right={<Text>{auth.userInfo.phoneNumber}</Text>}
          />
          <SettingButton text='Email' icon='email' right={<Text>{auth.userInfo.email}</Text>} />
          <SettingButton
            text='Địa chỉ'
            icon='map-marker'
            right={
              <Text>
                {auth.userInfo.dormitory}
                {auth.userInfo.building} - {auth.userInfo.room}
              </Text>
            }
          />
        </>
      )}

      <Divider />
      <SettingButton
        text='Trung tâm trợ giúp'
        icon='help-circle'
        onPress={() => {
          Linking.openURL('https://tsa-frontend-coral.vercel.app/landing');
        }}
      />

      <Divider />
      <SettingButton
        text='Cài đặt'
        icon='cog'
        onPress={() => {
          props.navigation.navigate('SettingScreen');
        }}
      />
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
