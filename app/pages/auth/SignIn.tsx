import { SCREEN } from '@constants/screen';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signInSchema, SignInSchemaType } from '@validations/auth.schema';
import {
  AuthStackParamList,
  HomeStackParamList,
  RootStackParamList,
} from 'app/types/navigation';
import { useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleIcon from '../../../assets/icons/googleIcon.svg';
import { EmailInput, PasswordInput } from './components/AuthForm';
import { useSignInMutation } from '@services/auth.service';
import Toast from 'react-native-root-toast';
import { getErrorMessage } from '@utils/helper';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { setToken, setUser, UserInfo } from '@slices/auth.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const Seperator = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  return (
    <View style={styles.seperatorContainer}>
      <View
        style={[
          styles.seperatorLine,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />
      <Text
        style={[
          globalStyles.text,
          styles.seperatorText,
          { color: theme.colors.onSurface },
        ]}
      >
        Hoặc
      </Text>
      <View
        style={[
          styles.seperatorLine,
          { backgroundColor: theme.colors.outlineVariant },
        ]}
      />
    </View>
  );
};

export const SignIn = (props: NativeStackScreenProps<RootStackParamList>) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const [login, { isLoading }] = useSignInMutation();
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<SignInSchemaType>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
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
        Toast.show(getErrorMessage(error), {
          position: Toast.positions.BOTTOM,
          backgroundColor: theme.colors.error,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      }
    };
    getEmail();
  }, []);
  const onSubmit = (data: SignInSchemaType) => {
    login(data)
      .unwrap()
      .then(async (res) => {
        if (res.userInfo) {
          await AsyncStorage.setItem('user', JSON.stringify(res.userInfo));
          dispatch(setUser(res.userInfo));
        }
        if (res.accessToken && res.refreshToken) {
          if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await SecureStore.setItemAsync('accessToken', res.accessToken);
            await SecureStore.setItemAsync('refreshToken', res.refreshToken);
          } else {
            await AsyncStorage.setItem('accessToken', res.accessToken);
            await AsyncStorage.setItem('refreshToken', res.refreshToken);
          }
          dispatch(
            setToken({
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            })
          );
          props.navigation.navigate('MainTab', {
            screen: 'Home',
          });
        }
      })
      .catch((err) => {
        Toast.show(getErrorMessage(err), {
          position: Toast.positions.BOTTOM,
          backgroundColor: theme.colors.error,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        { backgroundColor: theme.colors.primary },
        Platform.OS === 'ios' && {
          top: -insets.top,
          minHeight: SCREEN.height + insets.top + insets.bottom,
        },
      ]}
    >
      <Text
        style={[
          globalStyles.title,
          styles.header,
          { color: theme.colors.onPrimary, marginTop: insets.top + 16 },
        ]}
      >
        Đăng nhập
      </Text>
      <KeyboardAvoidingView
        style={[
          globalStyles.keyboardAvoidingView,
          {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={[
            styles.scrollView,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.formContainer}>
            <Text style={[globalStyles.title, styles.title]}>
              Chào mừng bạn đến với TSA
            </Text>
            <Text style={globalStyles.text}>
              Để kết nối với chúng tôi, hãy đăng nhập với tài khoản cá nhân của
              bạn
            </Text>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.googleButton}
            >
              <View style={styles.googleButtonContent}>
                <GoogleIcon width={24} height={24} />
                <Text
                  style={[
                    styles.buttonContent,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Đăng nhập với Google
                </Text>
              </View>
            </Button>
            <Seperator />
            <View>
              <EmailInput control={control} errors={errors} />
              <PasswordInput control={control} errors={errors} />
            </View>
            <TouchableOpacity>
              <Text
                style={[
                  globalStyles.text,
                  styles.forgotPasswordText,
                  { color: theme.colors.primary },
                ]}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
            <Button
              onPress={handleSubmit(onSubmit)}
              mode="contained"
              style={[globalStyles.wideButton, styles.loginButton]}
              labelStyle={styles.buttonContent}
              loading={isLoading}
              disabled={isLoading}
            >
              Đăng nhập
            </Button>
            <View style={styles.signUpContainer}>
              <Text style={globalStyles.text}>Chưa có tài khoản?</Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('AuthStack', {
                    screen: 'SignUp',
                  });
                }}
              >
                <Text
                  style={[
                    globalStyles.text,
                    styles.signUpText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    lineHeight: 39,
    textAlign: 'center',
  },
  buttonContent: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30,
  },

  scrollView: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
  },
  formContainer: {
    gap: 30,
  },
  googleButton: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  googleButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
  },
  loginButton: {
    borderRadius: 50,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    marginLeft: 4,
  },
  seperatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seperatorLine: {
    flex: 0.5,
    height: 1,
  },
  seperatorText: {
    marginHorizontal: 8,
  },
});
