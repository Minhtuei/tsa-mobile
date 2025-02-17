import { NavigatorScreenParams } from '@react-navigation/native';
import { Order } from './order';
import { ReportType } from './report';
import { UserInfo } from 'app/shared/state/auth.slice';
import { CreateOrderSchemaType } from 'app/features/order/schema/order.schema';
import { DeliverOrderDetail } from 'app/shared/state/delivery.slice';

type RootStackParamList = {
  SplashScreen: undefined;
  Onboarding: NavigatorScreenParams<AuthNavigatorParamList> | undefined;
  AuthNavigator: NavigatorScreenParams<AuthNavigatorParamList> | undefined;
  MainTab: NavigatorScreenParams<MainTabParamList> | undefined;
};

type AuthNavigatorParamList = {
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
  StaffTrackOrder: { order: DeliverOrderDetail };
};

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { order: Order };
  CreateOrder: { order?: CreateOrderSchemaType };
  TrackOrder: { order: Order };
  OrderPayment: { order: Order };
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
