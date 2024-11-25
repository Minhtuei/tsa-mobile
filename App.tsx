import { SCREEN } from '@constants/screen';
import { darkTheme, lightTheme } from '@constants/style';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useAppTheme } from '@hooks/theme';
import { AuthStack } from '@pages/auth/AuthStack';
import { Delivery } from '@pages/delivery/Delivery';
import { Home } from '@pages/home/Home';
import { Onboarding } from '@pages/Onboarding';
import { Order } from '@pages/order/Order';
import { Report } from '@pages/report/Report';
import { SplashScreen } from '@pages/SplashScreen';
import {
  CommonActions,
  LinkingOptions,
  NavigationContainer,
  useNavigationState
} from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiService } from '@services/api.service';
import { stopTimer } from '@slices/timer.slice';
import { store } from '@utils/store';
import { MainTabParamList, RootStackParamList } from 'app/types/navigation';
import { StatusBar } from 'expo-status-bar';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { PaperProvider, Portal } from 'react-native-paper';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import IconModal from '@components/IconModal';
import { Setting } from '@pages/account/setting/Setting';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerTranslation } from 'react-native-paper-dates';
import SocketProvider from 'socket';
import { Account } from '@pages/account/Account';
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
const Tab = createMaterialBottomTabNavigator<MainTabParamList>();

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
          <GestureHandlerRootView>
            <AppContent />
          </GestureHandlerRootView>
        </SocketProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const systemTheme = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme;
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

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
  const app = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
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
        id='MainTab'
        initialRouteName='Home'
        barStyle={{
          justifyContent: 'center',
          maxHeight: Platform.OS === 'ios' ? 64 : 80,
          backgroundColor: theme.colors.background,
          display: app.isHideTabBar ? 'none' : undefined
        }}
        activeColor={theme.colors.primary}
        activeIndicatorStyle={{
          backgroundColor: theme.colors.onPrimary
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: 'home',
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
        <Tab.Screen
          options={{
            tabBarIcon: 'shopping',
            title: 'Đơn hàng'
          }}
          name='Order'
          component={Order}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Order' }]
              });
            }
          })}
        />
        {auth.userInfo?.role === 'STUDENT' && (
          <Tab.Screen
            options={{
              tabBarIcon: 'file-document',
              title: 'Khiếu nại'
            }}
            name='Report'
            component={Report}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Report' }]
                });
              }
            })}
          />
        )}
        {auth.userInfo?.role === 'STAFF' && (
          <Tab.Screen
            options={{
              tabBarIcon: 'motorbike',
              title: 'Chuyến đi'
            }}
            name='Delivery'
            component={Delivery}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Delivery' }]
                });
              }
            })}
          />
        )}
        <Tab.Screen
          options={{
            tabBarIcon: 'account',
            title: 'Cá nhân'
          }}
          name='Account'
          component={Account}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default action
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
