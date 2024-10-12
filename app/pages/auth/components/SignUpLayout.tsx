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
import GoogleIcon from '../../../../assets/icons/googleIcon.svg';
import { EmailInput, PasswordInput } from './AuthForm';
import { AuthSeparator } from './AuthSeparator';
import StepIndicator from 'react-native-step-indicator';
import { STEPPER_STYLE } from '@constants/stepper';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
type SignUpLayoutProps = {
  title: string;
  onRedirect?: () => void;
  children: React.ReactNode;
  position: number;
  hideGoogleBtn?: boolean;
  onPressStepper?: () => void;
};
export const SignUpLayout = (props: SignUpLayoutProps) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { title, onRedirect, children, position, hideGoogleBtn } = props;
  const renderStepIndicator = (params: {
    position: number;
    stepStatus: string;
  }) => {
    if (params.stepStatus === 'finished') {
      return (
        <MaterialIcons name="check" size={24} color={theme.colors.onPrimary} />
      );
    }
    return <Text style={globalStyles.text}>{params.position}</Text>;
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
        Đăng ký
      </Text>
      <KeyboardAvoidingView
        style={[
          globalStyles.keyboardAvoidingView,
          {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={[
            styles.scrollView,
            {
              backgroundColor: theme.colors.background,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.formContainer,
              {
                marginBottom: Platform.OS === 'ios' ? 64 : 80,
              },
            ]}
          >
            <StepIndicator
              customStyles={STEPPER_STYLE}
              currentPosition={position}
              stepCount={3}
              renderStepIndicator={(params) => renderStepIndicator(params)}
            />
            <Text style={[globalStyles.title, styles.title]}>{title}</Text>

            {children}
            {!hideGoogleBtn && (
              <>
                <View style={styles.signUpContainer}>
                  <Text style={globalStyles.text}>Bạn đã có tài khoản?</Text>
                  <TouchableOpacity onPress={onRedirect}>
                    <Text
                      style={[
                        globalStyles.text,
                        styles.signUpText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      Đăng nhập
                    </Text>
                  </TouchableOpacity>
                </View>
                <AuthSeparator />
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
              </>
            )}
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
    gap: 20,
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
});