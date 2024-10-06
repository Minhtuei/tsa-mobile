import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { SignUpLayout } from './components/SignUpLayout';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from 'app/types/navigation';
import EmailIcon from '../../../assets/icons/emailIcon.svg';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSignUpMutation } from '@services/auth.service';
import Toast from 'react-native-root-toast';
import { getErrorMessage } from '@utils/helper';

export const VerifyEmail = (
  props: NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [resendEmail] = useSignUpMutation();

  const handleResendEmail = () => {
    if (!props.route.params.email) {
      return;
    }
    resendEmail({ email: props.route.params.email })
      .unwrap()
      .then(() => {
        Toast.show('Email đã được gửi', {
          position: Toast.positions.BOTTOM,
          containerStyle: { backgroundColor: theme.colors.success },
        });
      })
      .catch((error) => {
        Toast.show(getErrorMessage(error), {
          position: Toast.positions.BOTTOM,
          containerStyle: { backgroundColor: theme.colors.error },
        });
      });
  };
  return (
    <SignUpLayout
      position={1}
      title="Xác thực email"
      onRedirect={() => {
        props.navigation.navigate('SignIn');
      }}
    >
      <EmailIcon style={{ alignSelf: 'center' }} />
      <View style={globalStyles.center}>
        <Text
          style={[
            globalStyles.text,
            {
              fontWeight: 'bold',
              fontSize: 18,
            },
          ]}
        >
          Kiểm tra email của bạn
        </Text>
        <View style={[globalStyles.center, styles.textContainer]}>
          <Text
            style={[
              globalStyles.text,
              {
                fontWeight: 'bold',
                fontSize: 18,
              },
            ]}
          >
            Chưa nhận được email?{' '}
          </Text>
          <TouchableOpacity onPress={handleResendEmail}>
            <Text style={[globalStyles.text, styles.link]}> Gửi lại </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SignUpLayout>
  );
};
const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
  },
  link: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
});
