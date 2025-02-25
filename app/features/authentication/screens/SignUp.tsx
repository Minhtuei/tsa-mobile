import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getErrorMessage } from 'app/shared/utils/helper';
import { signUpSchema, SignUpSchemaType } from 'app/features/authentication/schema/auth.schema';
import { AuthNavigatorParamList } from 'app/shared/types/navigation';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import { useSignUpMutation } from '../api/auth.api';
import { EmailInput } from '../components/AuthForm';
import { SignUpLayout } from '../components/SignUpLayout';

export const SignUp = (props: NativeStackScreenProps<AuthNavigatorParamList, 'SignUp'>) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [signUp, { isLoading }] = useSignUpMutation();
  const {
    handleSubmit,
    formState: { errors },
    control
  } = useForm<SignUpSchemaType>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      email: ''
    }
  });
  const onSubmit = (data: SignUpSchemaType) => {
    signUp(data)
      .unwrap()
      .then(() => {
        props.navigation.navigate('VerifyEmail', {
          email: data.email
        });
      })
      .catch((error) => {
        Toast.show(getErrorMessage(error), {
          position: Toast.positions.CENTER
        });
      });
  };

  return (
    <SignUpLayout
      title='Nhập địa chỉ email'
      onRedirect={() => {
        props.navigation.navigate('SignIn');
      }}
      position={0}
    >
      <View>
        <EmailInput control={control} errors={errors} />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        mode='contained'
        style={[globalStyles.wideButton]}
        labelStyle={[globalStyles.text, { color: theme.colors.onPrimary, fontWeight: 'bold' }]}
        disabled={isLoading}
        loading={isLoading}
      >
        Tiếp tục
      </Button>
    </SignUpLayout>
  );
};
