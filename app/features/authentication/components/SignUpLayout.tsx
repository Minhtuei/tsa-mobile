import { SCREEN } from 'app/shared/constants/screen';
import { getStepperStyles } from 'app/shared/constants/stepper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import GoogleIcon from '../../../../assets/icons/googleIcon.svg';
import { AuthSeparator } from './AuthSeparator';
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
  const renderStepIndicator = (params: { position: number; stepStatus: string }) => {
    if (params.stepStatus === 'finished') {
      return <MaterialIcons name='check' size={24} color={theme.colors.onPrimary} />;
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
          minHeight: SCREEN.height + insets.top + insets.bottom
        }
      ]}
    >
      <Text
        style={[
          globalStyles.title,
          styles.header,
          { color: theme.colors.onPrimary, marginTop: insets.top + 16 }
        ]}
      >
        Đăng ký
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
          <View
            style={[
              styles.formContainer,
              {
                marginBottom: Platform.OS === 'ios' ? 64 : 80
              }
            ]}
          >
            <StepIndicator
              customStyles={getStepperStyles('center')}
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
                        { color: theme.colors.primary }
                      ]}
                    >
                      Đăng nhập
                    </Text>
                  </TouchableOpacity>
                </View>
                <AuthSeparator />
                <Button
                  mode='outlined'
                  onPress={() => {}}
                  style={styles.googleButton}
                  labelStyle={styles.googleButtonContent}
                >
                  <GoogleIcon width={24} height={24} />
                  Đăng nhập với Google
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
    flex: 1
  },
  header: {
    padding: 16
  },
  title: {
    fontSize: 26,
    lineHeight: 39,
    textAlign: 'center'
  },
  buttonContent: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 30
  },
  pressable: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32
  },
  formContainer: {
    gap: 20
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
  }
});
