import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getErrorMessage } from 'app/shared/utils/helper';
import { AuthNavigatorParamList } from 'app/shared/types/navigation';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import EmailIcon from '../../../../assets/icons/emailIcon.svg';
import { useSignUpMutation } from '../api/auth.api';
import { SignUpLayout } from '../components/SignUpLayout';

export const VerifyEmail = (
  props: NativeStackScreenProps<AuthNavigatorParamList, 'VerifyEmail'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [resendEmail] = useSignUpMutation();

  const handleResendEmail = () => {
    if (!props.route.params?.email) {
      return;
    }
    resendEmail({ email: props.route.params.email })
      .unwrap()
      .then(() => {
        Toast.show('Email đã được gửi', {
          position: Toast.positions.BOTTOM,
          containerStyle: { backgroundColor: theme.colors.success }
        });
      })
      .catch((error) => {
        Toast.show(getErrorMessage(error), {
          position: Toast.positions.BOTTOM,
          containerStyle: { backgroundColor: theme.colors.error }
        });
      });
  };
  return (
    <SignUpLayout
      position={1}
      title='Xác thực email'
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
              fontSize: 18
            }
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
                fontSize: 18
              }
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
    flexDirection: 'row'
  },
  link: {
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 18
  }
});
