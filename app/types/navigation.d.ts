import { NavigatorScreenParams } from '@react-navigation/native';
import { Order } from './order';
import { ReportType } from './report';
import { UserInfo } from '@slices/auth.slice';
import { CreateOrderSchemaType } from '@validations/order.schema';

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
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Order: NavigatorScreenParams<OrderStackParamList> | undefined;
  Notification: NavigatorScreenParams<NotificationStackParamList> | undefined;
  Account: NavigatorScreenParams<AccountStackParamList> | undefined;
  Delivery: NavigatorScreenParams<DeliveryStackParamList> | undefined;
};

type HomeStackParamList = {
  Dashboard: undefined;
};
type NotificationStackParamList = {
  NotificationList: undefined;
  NotificationDetail: { notificationId: string };
};

type DeliveryStackParamList = {
  DeliveryList: { deliveries: DeliveryDetail[] };
  DeliveryDetail: { deliveryId: string };
  StaffTrackOrder: { order: Order };
};

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { order: Order };
  CreateOrder: { order?: CreateOrderSchemaType };
  TrackOrder: { order: Order };
  OrderPayment: { amount: number };
};

type ReportStackParamList = {
  ReportList: undefined;
  ReportDetail: { report: ReportType };
  CreateReport: { orderId?: string } | undefined;
};

type AccountStackParamList = {
  SettingScreen: undefined;
  Profile: { userInfo: UserInfo | undefined };
  ChangeTheme: undefined;
  ChangePassword: undefined;
  AccountScreen: undefined;
  Report: NavigatorScreenParams<ReportStackParamList> | undefined;
};
