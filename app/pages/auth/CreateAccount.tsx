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
  RoomSelect
} from './components/AuthForm';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createAccountSchema, CreateAccountSchemaType } from '@validations/auth.schema';
import { BUILDINGS, DOMITORIES, ROOMS } from '@constants/domitory';
import { ActivityIndicator, Button, Portal } from 'react-native-paper';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useCompleteRegistrationMutation } from '@services/auth.service';
import { getErrorMessage } from '@utils/helper';
import IconModal from '@components/IconModal';
import { useEffect, useState } from 'react';

export const CreateAccount = (
  props: NativeStackScreenProps<AuthStackParamList, 'CreateAccount'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const [createAccount, { isLoading }] = useCompleteRegistrationMutation();
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
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
      building: ''
    }
  });

  useEffect(() => {
    if (props.route.params?.token) {
      setValue('token', props.route.params.token);
    }
  }, [props.route.params?.token]);
  const onSubmit = (data: CreateAccountSchemaType) => {
    const { confirmPassword, ...rest } = data;
    createAccount(rest)
      .unwrap()
      .then((data) => {
        setMsg('Tạo tài khoản thành công');
        setMsgType('success');
      })
      .catch((error) => {
        setMsg(getErrorMessage(error));
        setMsgType('error');
      });
  };
  const handleOnDismiss = (type: 'success' | 'error') => {
    if (type === 'success') {
      props.navigation.navigate('SignIn');
    }
    setMsg('');
  };

  return (
    <SignUpLayout
      position={2}
      title='Tạo tài khoản'
      onRedirect={() => {
        props.navigation.navigate('SignIn');
      }}
      hideGoogleBtn={true}
    >
      <Portal>
        <IconModal variant={msgType} message={msg} onDismiss={() => handleOnDismiss(msgType)} />
      </Portal>
      <View>
        <LastNameInput control={control} errors={errors} />
        <FirstNameInput control={control} errors={errors} />
        <PhoneNumberInput control={control} errors={errors} />
        <PasswordInput control={control} errors={errors} />
        <ConfirmPasswordInput control={control} errors={errors} />
        <DormitorySelect control={control} errors={errors} dormitories={DOMITORIES} />
        <BuildingSelect control={control} errors={errors} buildings={BUILDINGS} />
        <RoomSelect control={control} errors={errors} rooms={ROOMS} />
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        mode='contained'
        style={[globalStyles.wideButton]}
        labelStyle={[globalStyles.text, { color: theme.colors.onPrimary, fontWeight: 'bold' }]}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color={theme.colors.onPrimary} /> : 'Hoàn tất'}
      </Button>
    </SignUpLayout>
  );
};
