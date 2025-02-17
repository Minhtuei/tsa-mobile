import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { LoadingScreen } from 'app/shared/components/LoadingScreen';
import { SCREEN } from 'app/shared/constants/screen';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setToken, setUser, UserInfo } from 'app/shared/state/auth.slice';
import { googleSignIn } from '@services/google.service';
import { getErrorMessage } from 'app/shared/utils/helper';
import { saveToken, saveUserInfo } from 'app/shared/utils/userInfo';
import { signInSchema, SignInSchemaType } from 'app/features/authentication/schema/auth.schema';
import { RootStackParamList } from 'app/shared/types/navigation';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Portal, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleIcon from '../../../../assets/icons/googleIcon.svg';
import { useGoogleSignInMutation, useSignInMutation } from '../api/auth.api';
import { EmailInput, PasswordInput } from '../components/AuthForm';
const Seperator = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  return (
    <View style={styles.seperatorContainer}>
      <View style={[styles.seperatorLine, { backgroundColor: theme.colors.outlineVariant }]} />
      <Text style={[globalStyles.text, styles.seperatorText, { color: theme.colors.onSurface }]}>
        Hoặc
      </Text>
      <View style={[styles.seperatorLine, { backgroundColor: theme.colors.outlineVariant }]} />
    </View>
  );
};

export const SignIn = (props: NativeStackScreenProps<RootStackParamList>) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const [errMsg, setErrorMsg] = useState<string | null>(null);
  const [login, { isLoading }] = useSignInMutation();
  const [googleSignInBe, { isLoading: isGoogleLoading }] = useGoogleSignInMutation();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isAppReady, setAppReady] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control
  } = useForm<SignInSchemaType>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  useEffect(() => {
    const getEmail = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString) as UserInfo;
          setValue('email', user.email, { shouldValidate: true });
        }
      } catch (error) {
        setErrorMsg('Không thể lấy thông tin tài khoản');
      } finally {
        setAppReady(true);
      }
    };
    getEmail();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreenExpo.hideAsync();
    }
  }, [isAppReady]);
  if (!isAppReady) {
    return null;
  }
  const handleSignIn = async (
    signInMethod: 'email' | 'google',
    data?: SignInSchemaType,
    idToken?: string
  ) => {
    try {
      // Determine which sign-in method to use
      const apiCall =
        signInMethod === 'email'
          ? () => login(data as SignInSchemaType).unwrap()
          : () => googleSignInBe({ idToken: idToken as string }).unwrap();
      // Execute the API call
      const res = await apiCall();
      // Save user info if available
      if (res.userInfo) {
        await saveUserInfo(res.userInfo);
        dispatch(setUser(res.userInfo));
      }
      // Save tokens if available
      if (res.accessToken && res.refreshToken) {
        await saveToken(res.accessToken, res.refreshToken);
        dispatch(
          setToken({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken
          })
        );
      }
      // Navigate to the main app
      props.navigation.navigate('MainTab', {
        screen: 'Home'
      });
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        { backgroundColor: theme.colors.primary },
        Platform.OS === 'ios' && {
          top: -insets.top,
          minHeight: SCREEN.height + insets.top + insets.bottom
        }
      ]}
      onLayout={onLayoutRootView}
    >
      <Text
        style={[
          globalStyles.title,
          styles.header,
          { color: theme.colors.onPrimary, marginTop: insets.top + 16 }
        ]}
      >
        Đăng nhập
      </Text>
      <KeyboardAvoidingView
        style={[
          globalStyles.keyboardAvoidingView,
          {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24
          }
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
      >
        <ScrollView
          keyboardShouldPersistTaps='never'
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        >
          <View style={styles.formContainer}>
            <Text style={[globalStyles.title, styles.title]}>Chào mừng bạn đến với TSA</Text>
            <Text style={globalStyles.text}>
              Để kết nối với chúng tôi, hãy đăng nhập với tài khoản cá nhân của bạn
            </Text>
            <View>
              <EmailInput control={control} errors={errors} />
              <PasswordInput control={control} errors={errors} />
            </View>
            <TouchableOpacity>
              <Text
                style={[
                  globalStyles.text,
                  styles.forgotPasswordText,
                  { color: theme.colors.primary }
                ]}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
            <Button
              onPress={handleSubmit((data) => handleSignIn('email', data))}
              mode='contained'
              style={[globalStyles.wideButton, styles.loginButton]}
              labelStyle={styles.buttonContent}
              loading={isLoading}
              disabled={isLoading || isGoogleLoading}
            >
              Đăng nhập
            </Button>
            <View style={styles.signUpContainer}>
              <Text style={globalStyles.text}>Chưa có tài khoản?</Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('AuthNavigator', {
                    screen: 'SignUp'
                  });
                }}
              >
                <Text
                  style={[globalStyles.text, styles.signUpText, { color: theme.colors.primary }]}
                >
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
            <Seperator />
            <Button
              mode='outlined'
              onPress={async () => {
                const { idToken, error } = await googleSignIn();
                if (idToken) {
                  handleSignIn('google', undefined, idToken);
                } else {
                  setErrorMsg(error);
                }
              }}
              style={styles.googleButton}
              labelStyle={styles.googleButtonContent}
              disabled={isGoogleLoading || isLoading}
              loading={isGoogleLoading}
            >
              <GoogleIcon width={24} height={24} />
              Đăng nhập với Google
            </Button>
          </View>
          <Portal>
            {(isGoogleLoading || isLoading) && <LoadingScreen />}
            <ConfirmationDialog
              visible={!!errMsg}
              setVisible={() => setErrorMsg(null)}
              notShowCancel={true}
              title='Thông báo'
              content={errMsg || ''}
              onSubmit={() => {
                if (errMsg) {
                  setErrorMsg(null);
                }
              }}
            />
          </Portal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  header: {
    padding: 16
  },
  title: {
    fontSize: 22,
    lineHeight: 39,
    textAlign: 'center'
  },
  buttonContent: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30
  },

  scrollView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32
  },
  formContainer: {
    gap: 24
  },
  googleButton: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  googleButtonContent: {
    transform: [{ translateX: 10 }, { translateY: -6 }]
  },
  forgotPasswordText: {
    alignSelf: 'flex-end'
  },
  loginButton: {
    borderRadius: 50
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signUpText: {
    marginLeft: 4
  },
  seperatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  seperatorLine: {
    flex: 0.5,
    height: 1
  },
  seperatorText: {
    marginHorizontal: 8
  }
});
