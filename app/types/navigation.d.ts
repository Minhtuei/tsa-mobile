import { NavigatorScreenParams } from '@react-navigation/native';

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
};

type HomeStackParamList = {
  Dashboard: undefined;
};

type OrderStackParamList = {
  OrderList: undefined;
  OrderDetail: { order: Order };
};

type ReportStackParamList = {
  ReportList: undefined;
  ReportDetail: undefined;
};

type SettingStackParamList = {
  SettingScreen: undefined;
  Profile: undefined;
  ChangeTheme: undefined;
  ChangePassword: undefined;
  //   DeleteAccount: undefined; need for deploy on IOS
};
