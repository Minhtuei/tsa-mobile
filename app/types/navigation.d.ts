import { NavigatorScreenParams } from '@react-navigation/native';
import { Order } from './order';

type RootStackParamList = {
  SplashScreen: undefined;
  Onboarding: NavigatorScreenParams<AuthStackParamList> | undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTab: NavigatorScreenParams<MainTabParamList> | undefined;
};

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { email?: string } | undefined;
  CreateAccount: { token: string };
};

type MainTabParamList = {
  Home: undefined;
  Order: undefined;
  Report: undefined;
  Setting: undefined;
  Delivery: undefined;
};

type HomeStackParamList = {
  Dashboard: undefined;
};

type DeliveryStackParamList = {
  DeliveryList: { deliveries: DeliveryDetail[] };
  DeliveryDetail: { deliveryId: string };
};

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { order: Order };
  CreateOrder: undefined;
  TrackOrder: { order: Order };
};

type ReportStackParamList = {
  ReportList: undefined;
  ReportDetail: undefined;
  CreateReport: undefined;
};

type SettingStackParamList = {
  SettingScreen: undefined;
  Profile: undefined;
  ChangeTheme: undefined;
  ChangePassword: undefined;
  //   DeleteAccount: undefined; need for deploy on IOS
};
