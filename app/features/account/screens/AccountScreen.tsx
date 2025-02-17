import IconModal from 'app/shared/components/IconModal';
import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { removeUser, UserInfo } from 'app/shared/state/auth.slice';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import React, { useMemo, useState } from 'react';
import { Image, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { Divider, Portal, Text } from 'react-native-paper';

import { AccountHeader } from 'app/shared/components/AccountHeader';
import { PreViewImageModal } from 'app/shared/components/PreviewImageModal';
import SettingButton from 'app/shared/components/SettingButton';
import { DASHBOARD_HEADER_HEIGHT } from 'app/shared/constants/screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { googleSignOut } from '@services/google.service';
import { getErrorMessage } from 'app/shared/utils/helper';
import { useLogoutMutation } from 'app/features/authentication/api/auth.api';
import { AccountStackParamList } from 'app/shared/types/navigation';

// Dùng làm điều kiện hiển thị tính năng 'Xoá Tài Khoản' --> chỉ hiển thị cho Apple review
const APPLE_DEMO_ACCOUNT_NAME = 'Nguyen Van A'; // Account name của tài khoản Demo cung cấp cho Apple
export const AccountScreen = (
  props: NativeStackScreenProps<AccountStackParamList, 'AccountScreen'>
) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const userInfo = auth.userInfo;
  const theme = useAppTheme();

  // Show error then log out
  const [logOutErr, setlogOutErr] = useState('');
  // Show error but doesn't log out
  const [unregisterErr, setUnregisterErr] = useState('');
  const [logOut, { isLoading: logOutLoading }] = useLogoutMutation();
  const [visible, setVisible] = useState(false);

  const isVerified = useMemo(() => {
    if (userInfo) {
      return Object.keys(userInfo || {})
        .filter((key) => key !== 'photoUrl')
        .every(
          (key) =>
            userInfo[key as keyof UserInfo] !== undefined &&
            userInfo[key as keyof UserInfo] !== null
        );
    }
    return false;
  }, [userInfo]);
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
        console.log(err);
        setlogOutErr(getErrorMessage(err));
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
    const { error } = await googleSignOut();
    if (error) {
      setlogOutErr(error);
    }
    dispatch(removeUser());
  };

  const globalStyles = useGlobalStyles();
  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background, flex: 1 }}
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{
        flexGrow: 1
      }}
    >
      <View style={{ position: 'relative' }}>
        <AccountHeader
          backgroundUrl={userInfo?.photoUrl}
          onRightPress={() => {
            if (userInfo) props.navigation.navigate('Profile', { userInfo: userInfo });
          }}
        />
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.background,
            transform: [{ translateY: DASHBOARD_HEADER_HEIGHT / 1.2 - 32 }],
            borderWidth: 1,
            borderBottomWidth: 0
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
              }}
              style={{
                backgroundColor: theme.colors.primary,
                width: 100,
                height: 100,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ translateY: -50 }],
                elevation: 14
              }}
            >
              {userInfo?.photoUrl ? (
                <Image
                  source={{ uri: userInfo?.photoUrl }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: theme.colors.onBackground
                  }}
                  resizeMethod='resize'
                  resizeMode='cover'
                />
              ) : (
                <FontAwesome name='user' size={50} color='white' />
              )}
              {isVerified ? (
                <FontAwesome
                  name='check'
                  size={24}
                  color={theme.colors.onPrimary}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 16,
                    padding: 4,
                    elevation: 5
                  }}
                />
              ) : (
                <FontAwesome
                  name='exclamation'
                  size={24}
                  color={theme.colors.error}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.colors.background,
                    borderRadius: 16,
                    padding: 4,
                    elevation: 5
                  }}
                />
              )}
            </TouchableOpacity>
            {userInfo && (
              <View style={{ marginTop: -32, alignItems: 'center' }}>
                <Text style={[globalStyles.text, { fontSize: 20 }]}>
                  {userInfo.lastName} {userInfo.firstName}
                </Text>
                <Text
                  style={[
                    globalStyles.text,
                    { fontSize: 14, fontStyle: 'italic', color: theme.colors.secondary }
                  ]}
                >
                  {userInfo.role === 'STUDENT' ? 'Sinh viên' : 'Nhân viên'}
                </Text>
                {!isVerified && (
                  <Text
                    style={[
                      globalStyles.text,
                      { fontSize: 14, fontStyle: 'italic', color: theme.colors.error }
                    ]}
                  >
                    Chưa cập nhật thông tin
                  </Text>
                )}
              </View>
            )}
          </View>
          {userInfo?.phoneNumber && (
            <SettingButton
              text='Số điện thoại'
              icon='phone'
              right={<Text>{userInfo.phoneNumber}</Text>}
            />
          )}
          {userInfo?.email && (
            <SettingButton text='Email' icon='email' right={<Text>{userInfo.email}</Text>} />
          )}
          {userInfo?.dormitory && (
            <SettingButton
              text='Địa chỉ'
              icon='map-marker'
              right={
                <Text>
                  {userInfo.building} - {userInfo.room}
                </Text>
              }
            />
          )}
          <Divider />
          {auth.userInfo?.role === 'STUDENT' && (
            <>
              <SettingButton
                text='Khiếu nại'
                icon='alert-circle'
                onPress={() => {
                  props.navigation.navigate('Report');
                }}
              />

              <Divider />
            </>
          )}
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
            <PreViewImageModal
              visible={visible}
              setVisible={setVisible}
              proofUri={userInfo?.photoUrl || ''}
              setValue={(field, value) => {}}
              disabled={true}
              title='Ảnh đại diện'
            />
          </Portal>
        </View>
      </View>
    </ScrollView>
  );
};
