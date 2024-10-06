import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpLayout } from './components/SignUpLayout';
import { AuthStackParamList } from 'app/types/navigation';
import {
  BuildingSelect,
  ConfirmPasswordInput,
  DormitorySelect,
  EmailInput,
  FirstNameInput,
  LastNameInput,
  PasswordInput,
  PhoneNumberInput,
  RoomSelect,
} from './components/AuthForm';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createAccountSchema,
  CreateAccountSchemaType,
} from '@validations/auth.schema';
import { BUILDINGS, DOMITORIES, ROOMS } from '@constants/domitory';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useCompleteRegistrationMutation } from '@services/auth.service';
import Toast from 'react-native-root-toast';
import { getErrorMessage } from '@utils/helper';

export const CreateAccount = (
  props: NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [createAccount, { isLoading }] = useCompleteRegistrationMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createAccountSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      dormitory: '',
      room: '',
      building: '',
    },
  });
  const onSubmit = (data: CreateAccountSchemaType) => {
    console.log(data);
    createAccount(data)
      .unwrap()
      .then((data) => {
        console.log(data);
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
      position={2}
      title="Tạo tài khoản"
      onRedirect={() => {
        props.navigation.navigate('SignIn');
      }}
    >
      <View>
        <LastNameInput control={control} errors={errors} />
        <FirstNameInput control={control} errors={errors} />
        <PhoneNumberInput control={control} errors={errors} />
        <PasswordInput control={control} errors={errors} />
        <ConfirmPasswordInput control={control} errors={errors} />
        <DormitorySelect
          control={control}
          errors={errors}
          dormitories={DOMITORIES}
        />
        <BuildingSelect
          control={control}
          errors={errors}
          buildings={BUILDINGS}
        />
        <RoomSelect control={control} errors={errors} rooms={ROOMS} />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        mode="contained"
        style={[globalStyles.wideButton]}
        labelStyle={[
          globalStyles.text,
          { color: theme.colors.onPrimary, fontWeight: 'bold' },
        ]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.onPrimary} />
        ) : (
          'Tiếp tục'
        )}
      </Button>
    </SignUpLayout>
  );
};
