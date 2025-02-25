import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform } from 'expo-modules-core';
import React, { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { Divider, Portal, Switch } from 'react-native-paper';

import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import SettingButton from 'app/shared/components/SettingButton';

import { getErrorMessage } from 'app/shared/utils/helper';
import { useNotification } from 'app/shared/context/NotificationContext';
import {
  useCheckPushNotiMutation,
  useRegisterPushNotiMutation,
  useUnRegisterPushNotiMutation
} from 'app/features/notification/api/notification.api';
import { AccountStackParamList } from 'app/shared/types/navigation';

// Dùng làm điều kiện hiển thị tính năng 'Xoá Tài Khoản' --> chỉ hiển thị cho Apple review
const APPLE_DEMO_ACCOUNT_NAME = 'Nguyen Van A'; // Account name của tài khoản Demo cung cấp cho Apple
export const SettingScreen = (
  props: NativeStackScreenProps<AccountStackParamList, 'SettingScreen'>
) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const theme = useAppTheme();

  // Show error then log out
  const [notiErr, setNotiErr] = useState('');
  // Show error but doesn't log out
  const [unregisterErr, setUnregisterErr] = useState('');
  const [notification, setNotification] = useState(false);
  const [checkPushNoti, { isLoading: checkPushNotiLoading }] = useCheckPushNotiMutation();
  const [registerPushNoti, { isLoading: registerPushNotiLoading }] = useRegisterPushNotiMutation();
  const [unregisterPushNoti, { isLoading: unregisterPushNotiLoading }] =
    useUnRegisterPushNotiMutation();
  const { deviceToken, error } = useNotification();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (auth.userInfo && deviceToken) {
      checkPushNoti({
        userId: auth.userInfo.id,
        token: deviceToken
      })
        .unwrap()
        .then((data) => {
          if (data.pusNotiType === 'ENABLED') {
            setNotification(true);
          } else {
            setNotification(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setNotiErr(getErrorMessage(err));
        });
    }
  }, [auth.userInfo, deviceToken]);
  const handleUnregister = () => {
    if (auth.userInfo && deviceToken) {
      unregisterPushNoti({
        userId: auth.userInfo.id,
        token: deviceToken,
        type: 'DISABLED'
      })
        .unwrap()
        .then(() => {
          setNotification(false);
        })
        .catch((err) => {
          setUnregisterErr(getErrorMessage(err));
        });
    }
  };

  const handleRegister = () => {
    if (error) {
      console.log(error);
      setNotiErr(getErrorMessage(error));
      return;
    }
    if (auth.userInfo && deviceToken) {
      registerPushNoti({
        userId: auth.userInfo.id,
        token: deviceToken,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
      })
        .unwrap()
        .then(() => {
          setNotification(true);
        })
        .catch((err) => {
          setNotiErr(getErrorMessage(err));
        });
    }
  };

  return (
    <View style={globalStyles.fullScreen}>
      {Platform.OS !== 'ios' && (
        <>
          <SettingButton
            text='Thông báo đẩy'
            icon='bell'
            right={
              <Switch
                value={notification}
                onValueChange={() => {
                  if (notification) {
                    handleUnregister();
                  } else {
                    handleRegister();
                  }
                }}
                color={theme.colors.primary}
                disabled={
                  checkPushNotiLoading || registerPushNotiLoading || unregisterPushNotiLoading
                }
              />
            }
            loading={checkPushNotiLoading || registerPushNotiLoading || unregisterPushNotiLoading}
            disabled={checkPushNotiLoading || registerPushNotiLoading || unregisterPushNotiLoading}
          />
          <Divider />
        </>
      )}
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

      <Portal>
        <ConfirmationDialog
          visible={notiErr !== ''}
          setVisible={() => setNotiErr('')}
          title='Lỗi'
          content={notiErr}
          onSubmit={() => {
            Linking.openSettings();
            setNotiErr('');
          }}
        />
      </Portal>
    </View>
  );
};
