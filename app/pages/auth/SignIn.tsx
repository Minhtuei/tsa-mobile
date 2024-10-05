import { SCREEN } from '@constants/screen';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signInSchema, SignInSchemaType } from '@validations/auth.schema';
import { AuthStackParamList } from 'app/types/navigation';
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

export const SignIn = (
  props: NativeStackScreenProps<AuthStackParamList, 'SignIn'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<SignInSchemaType>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = (data: SignInSchemaType) => {
    console.log(data);
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
        style={globalStyles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.pressable} onPress={Keyboard.dismiss}>
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
                Để kết nối với chúng tôi, hãy đăng nhập với tài khoản cá nhân
                của bạn
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
              >
                Đăng nhập
              </Button>
              <View style={styles.signUpContainer}>
                <Text style={globalStyles.text}>Chưa có tài khoản?</Text>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('SignUp', { stepper: 0 });
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
        </Pressable>
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
  pressable: {
    flex: 1,
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
