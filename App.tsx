import { SCREEN } from '@constants/screen';
import { darkTheme, lightTheme } from '@constants/style';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useAppTheme } from '@hooks/theme';
import { AuthStack } from '@pages/auth/AuthStack';
import { Delivery } from '@pages/delivery/Delivery';
import { Home } from '@pages/home/Home';
import { Onboarding } from '@pages/Onboarding';
import { Order } from '@pages/order/Order';
import { SplashScreen } from '@pages/SplashScreen';
import { CommonActions, LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiService } from '@services/api.service';
import { stopTimer } from '@slices/timer.slice';
import { store } from '@utils/store';
import { MainTabParamList, RootStackParamList } from 'app/types/navigation';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform, TextInput, useColorScheme, Text } from 'react-native';
import { PaperProvider, Portal } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { CustomTabbar } from '@components/CustomTabbar';
import IconModal from '@components/IconModal';
import { Account } from '@pages/account/Account';
import { Notification } from '@pages/notification/Notification';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NotificationProvider } from 'app/context/NotificationContext';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerTranslation } from 'react-native-paper-dates';
import SocketProvider from 'app/context/SocketContext';
import moment from 'moment';
import 'moment/locale/vi';
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
      AuthStack: {
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
              name='AuthStack'
              component={AuthStack}
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
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (auth.refreshToken === null) {
      dispatch(stopTimer());
      dispatch(apiService.util.resetApiState());
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'AuthStack' }]
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
          component={Home}
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
            component={Delivery}
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
            component={Order}
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
          component={Notification}
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
          component={Account}
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
