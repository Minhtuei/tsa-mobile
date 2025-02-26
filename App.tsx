import { CommonActions, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiService } from '@services/api.service';
import { store } from '@slices/store';
import { Onboarding } from 'app/features/onboarding/Onboarding';
import { SplashScreen } from 'app/features/splash/SplashScreen';
import { AuthNavigator } from 'app/navigation/AuthNavigator';
import { DeliveryNavigator } from 'app/navigation/DeliveryNavigator';
import { HomeNavigator } from 'app/navigation/HomeNavigator';
import { OrderNavigator } from 'app/navigation/OrderNavigator';
import { SCREEN } from 'app/shared/constants/screen';
import { darkTheme, lightTheme } from 'app/shared/constants/style';
import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme } from 'app/shared/hooks/theme';
import { stopTimer } from 'app/shared/state/timer.slice';
import { MainTabParamList, RootStackParamList } from 'app/shared/types/navigation';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform, Text, TextInput, useColorScheme } from 'react-native';
import { PaperProvider, Portal } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useLocationUpdater from '@hooks/location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { setCurrentOrderId } from '@slices/app.slice';
import { useGetCurrentOrderQuery } from 'app/features/order/api/order.api';
import { AccountNavigator } from 'app/navigation/AccountNavigator';
import { NotificationNavigator } from 'app/navigation/NotificationNavigator';
import { CustomTabbar } from 'app/shared/components/CustomTabbar';
import IconModal from 'app/shared/components/IconModal';
import { NotificationProvider } from 'app/shared/context/NotificationContext';
import SocketProvider, { useSocketContext } from 'app/shared/context/SocketContext';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreenExpo from 'expo-splash-screen';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerTranslation } from 'react-native-paper-dates';
moment.locale('vi');
/**
 * Below code is to limit the max size of text font user can custom in Accessibility
 * StackOverflow: https://stackoverflow.com/a/65193181/27724785
 */
interface TextWithDefaultProps extends Text {
  defaultProps?: { maxFontSizeMultiplier?: number };
}
interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: { maxFontSizeMultiplier?: number };
}
(Text as unknown as TextWithDefaultProps).defaultProps =
  (Text as unknown as TextWithDefaultProps).defaultProps || {};
(Text as unknown as TextWithDefaultProps).defaultProps!.maxFontSizeMultiplier = 1.5;
(TextInput as unknown as TextInputWithDefaultProps).defaultProps =
  (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
(TextInput as unknown as TextInputWithDefaultProps).defaultProps!.maxFontSizeMultiplier = 1.5;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

registerTranslation('vi', {
  save: 'Lưu',
  selectSingle: 'Chọn ngày',
  selectMultiple: 'Chọn nhiều ngày',
  selectRange: 'Chọn khoảng ngày',
  notAccordingToDateFormat: (inputFormat) => `Định dạng ngày phải là ${inputFormat}`,
  mustBeHigherThan: (date) => `Phải sau ${date}`,
  mustBeLowerThan: (date) => `Phải trước ${date}`,
  mustBeBetween: (startDate, endDate) => `Phải nằm trong khoảng ${startDate} và ${endDate}`,
  dateIsDisabled: 'Ngày bị vô hiệu hóa',
  previous: 'Trước đó',
  next: 'Tiếp theo',
  typeInDate: 'Nhập ngày',
  pickDateFromCalendar: 'Chọn ngày từ lịch',
  close: 'Đóng',
  hour: 'Giờ',
  minute: 'Phút'
});

const prefix = Linking.createURL('/');
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix],
  config: {
    screens: {
      AuthNavigator: {
        screens: {
          CreateAccount: {
            path: 'create-account/:token',
            parse: {
              token: (token) => decodeURIComponent(token)
            }
          }
        }
      }
    }
  }
};
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <SocketProvider>
          <NotificationProvider>
            <GestureHandlerRootView>
              <AppContent />
            </GestureHandlerRootView>
          </NotificationProvider>
        </SocketProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const systemTheme = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreenExpo.hideAsync();
    }, 5000);
  }, []);
  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        Platform.OS === 'ios' && {
          top: -insets.top,
          minHeight: SCREEN.height + insets.top + insets.bottom
        }
      ]}
    >
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme as any} linking={linking}>
          <RootStack.Navigator
            initialRouteName='SplashScreen'
            screenOptions={{ headerShown: false }}
          >
            <RootStack.Screen
              name='SplashScreen'
              component={SplashScreen}
              options={{
                navigationBarColor: systemTheme.colors.background
              }}
            />
            <RootStack.Screen
              name='Onboarding'
              component={Onboarding}
              options={{
                navigationBarColor: theme.colors.background
              }}
            />
            <RootStack.Screen
              name='AuthNavigator'
              component={AuthNavigator}
              options={{
                navigationBarColor: theme.colors.background
              }}
            />
            <RootStack.Screen
              name='MainTab'
              component={MainTab}
              options={{
                navigationBarColor: theme.colors.elevation.level1
              }}
            />
          </RootStack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}

const MainTab = (props: NativeStackScreenProps<RootStackParamList, 'MainTab'>) => {
  const theme = useAppTheme();
  const auth = useAppSelector((state) => state.auth);
  const staffId = auth.userInfo?.id;

  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const { socket } = useSocketContext();

  const { data } = useGetCurrentOrderQuery();
  const orderId = data?.id;

  useEffect(() => {
    if (orderId) {
      dispatch(setCurrentOrderId(orderId));
    }
  }, [data]);

  useLocationUpdater(socket, orderId, staffId);

  useEffect(() => {
    if (auth.refreshToken === null) {
      dispatch(stopTimer());
      dispatch(apiService.util.resetApiState());
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthNavigator' }]
        })
      );
    }
  }, [auth.refreshToken, dispatch, props.navigation]);

  return (
    <>
      <Portal>
        <IconModal
          variant={'error'}
          message={message}
          onDismiss={() => {
            setMessage('');
          }}
        />
      </Portal>

      <StatusBar style={theme.dark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <Tab.Navigator
        tabBar={(props) => <CustomTabbar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarAllowFontScaling: false
        }}
      >
        <Tab.Screen
          options={{
            title: 'Trang chủ'
          }}
          name='Home'
          component={HomeNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
              });
            }
          })}
        />

        {auth.userInfo?.role === 'STAFF' ? (
          <Tab.Screen
            options={{
              title: 'Chuyến đi'
            }}
            name='Delivery'
            component={DeliveryNavigator}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Delivery' }]
                });
              }
            })}
          />
        ) : (
          <Tab.Screen
            options={{
              title: 'Đơn hàng'
            }}
            name='Order'
            component={OrderNavigator}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                e.preventDefault();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Order' }]
                });
              }
            })}
          />
        )}
        <Tab.Screen
          options={{
            title: 'Thông báo'
          }}
          name='Notification'
          component={NotificationNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Notification' }]
              });
            }
          })}
        />
        <Tab.Screen
          options={{
            title: 'Cá nhân'
          }}
          name='Account'
          component={AccountNavigator}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Account' }]
              });
            }
          })}
        />
      </Tab.Navigator>
    </>
  );
};
