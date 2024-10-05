import { NavigatorScreenParams } from '@react-navigation/native';

type RootStackParamList = {
  SplashScreen: undefined;
  Onboarding: NavigatorScreenParams<AuthStackParamList> | undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList> | undefined;
  MainTab: NavigatorScreenParams<MainTabParamList> | undefined;
};

type AuthStackParamList = {
  SignIn: undefined;
  SignUp: { stepper: number };
  ForgotPassword: undefined;
  VerifyEmail: { stepper: number; email: string };
  CreateAccount: { stepper: number };
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
  OrderDetail: undefined;
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
