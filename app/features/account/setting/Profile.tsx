import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { AccountStackParamList } from 'app/shared/types/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Portal, Text } from 'react-native-paper';

import { DropDownList } from '@components/order/DropDownList';
import { useUpdateUserInfoMutation } from 'app/features/account/api/profile.api';
import {
  FirstNameInput,
  LastNameInput,
  PhoneNumberInput
} from 'app/features/authentication/components/AuthForm';
import {
  updateAccountSchema,
  UpdateAccountSchemaType
} from 'app/features/authentication/schema/auth.schema';
import { useUpLoadImageMutation } from 'app/features/report/api/report.api';
import { ChooseImageModal } from 'app/shared/components/ChooseImageModal';
import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { LoadingScreen } from 'app/shared/components/LoadingScreen';
import { PreViewImageModal } from 'app/shared/components/PreviewImageModal';
import { BUILDING_DATA, DOMITORY_DATA, ROOM_DATA } from 'app/shared/constants/domitory';
import { useAppDispatch, useAppSelector } from 'app/shared/hooks/redux';
import { setUser } from 'app/shared/state/auth.slice';
import { saveUserInfo } from 'app/shared/utils/userInfo';
import { PhotoInput } from '../components/ProfileField';
export const Profile = (props: NativeStackScreenProps<AccountStackParamList, 'Profile'>) => {
  const { userInfo } = props.route.params;
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [viewImageModalVisible, setViewImageModalVisible] = useState(false);
  const [uploadImage, { isLoading: isUploadImageLoading }] = useUpLoadImageMutation();
  const [updateProfile, { isLoading: isUpdateProfileLoading }] = useUpdateUserInfoMutation();
  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [fileType, setFileType] = useState<string | null | undefined>(null);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    reset
  } = useForm<UpdateAccountSchemaType>({
    resolver: yupResolver(updateAccountSchema),
    defaultValues: {
      lastName: userInfo?.lastName,
      firstName: userInfo?.firstName,
      phoneNumber: userInfo?.phoneNumber,
      photoUrl: userInfo?.photoUrl,
      dormitory: userInfo?.dormitory,
      room: userInfo?.room,
      building: userInfo?.building
    }
  });
  const canUpdate =
    userInfo?.lastName !== watch('lastName') ||
    userInfo?.firstName !== watch('firstName') ||
    userInfo?.phoneNumber !== watch('phoneNumber') ||
    userInfo?.photoUrl !== watch('photoUrl') ||
    userInfo?.dormitory !== watch('dormitory') ||
    userInfo?.room !== watch('room') ||
    userInfo?.building !== watch('building');

  const dormitory = watch('dormitory') as keyof typeof BUILDING_DATA;
  const onSubmit = async (data: UpdateAccountSchemaType) => {
    if (canUpdate) {
      try {
        let proofUri = data.photoUrl;
        // TH có ảnh mới và ảnh cũ
        if (data.photoUrl && userInfo?.photoUrl && data.photoUrl !== userInfo?.photoUrl) {
          const formData = new FormData();
          const file = {
            uri: data.photoUrl,
            name: fileName,
            type: fileType
          } as any;
          formData.append('image', file);
          const result = await uploadImage(formData).unwrap();
          proofUri = result.url;
        }

        const validateData = {
          ...data,
          photoUrl: proofUri
        };
        await updateProfile(validateData).unwrap();
        if (auth.userInfo) {
          const castUserInfo = {
            ...auth.userInfo,
            ...validateData,
            id: auth.userInfo.id,
            role: auth.userInfo.role,
            createdAt: auth.userInfo.createdAt,
            status: auth.userInfo.status,
            verified: auth.userInfo.verified,
            email: auth.userInfo.email
          };
          dispatch(setUser(castUserInfo));
          await saveUserInfo(castUserInfo);
        }
        setSuccessMsg('Cập nhật thông tin thành công');
      } catch (error) {
        setErrorMsg('Cập nhật thông tin thất bại');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
    >
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={[{ paddingBottom: 32, backgroundColor: theme.colors.background }]}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ gap: 24 }}>
            <View style={[globalStyles.vstack, { gap: 24 }]}>
              <PhotoInput
                errors={errors}
                control={control}
                setProofModalVisible={setProofModalVisible}
                setViewImageModalVisible={setViewImageModalVisible}
              />
              <LastNameInput errors={errors} control={control} />
              <FirstNameInput errors={errors} control={control} />
              <PhoneNumberInput errors={errors} control={control} />

              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Ký túc xá
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={DOMITORY_DATA}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn ký túc xá'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'dormitory'}
                />
                {errors.dormitory && (
                  <Text style={{ color: 'red' }}>{errors.dormitory.message}</Text>
                )}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Tòa nhà
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={dormitory ? BUILDING_DATA[dormitory] : BUILDING_DATA['B']}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn tòa nhà'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'building'}
                />
                {errors.building && <Text style={{ color: 'red' }}>{errors.building.message}</Text>}
              </View>
              <View
                style={{
                  width: '100%',
                  gap: 8
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Phòng
                </Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropDownList
                      data={ROOM_DATA}
                      value={value}
                      setValue={onChange}
                      placeholder='Chọn phòng'
                      containerStyle={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: 0,
                        borderWidth: 1,
                        borderColor: theme.colors.outline
                      }}
                    />
                  )}
                  name={'room'}
                />
                {errors.room && <Text style={{ color: 'red' }}>{errors.room.message}</Text>}
              </View>
            </View>
            <Button
              onPress={() => {
                setVisible(true);
              }}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              style={{ width: '80%', marginHorizontal: 'auto' }}
              loading={isUploadImageLoading}
              disabled={isUploadImageLoading || !canUpdate || isUpdateProfileLoading}
              icon={'check'}
            >
              Cập nhật
            </Button>
            <Button
              onPress={() => {
                reset();
              }}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onSecondary}
              style={{ width: '80%', marginHorizontal: 'auto' }}
              loading={isUploadImageLoading}
              disabled={isUploadImageLoading || !canUpdate}
              icon={'cancel'}
            >
              Huỷ bỏ
            </Button>
          </View>
        </View>

        <Portal>
          {(isUpdateProfileLoading || isUploadImageLoading) && <LoadingScreen />}
          <ChooseImageModal
            title='Chọn ảnh minh chứng'
            visible={proofModalVisible}
            setVisible={setProofModalVisible}
            onSuccess={({ uri, name, type }) => {
              setValue('photoUrl', uri);
              setFileName(name);
              setFileType(type);
            }}
          />
          <PreViewImageModal
            visible={viewImageModalVisible}
            setVisible={setViewImageModalVisible}
            proofUri={watch('photoUrl') || ''}
            setValue={(field, value) => setValue('photoUrl', value)}
            title='Ảnh đại diện'
          />
          <ConfirmationDialog
            visible={visible}
            setVisible={setVisible}
            onSubmit={() => {
              handleSubmit(onSubmit)();
            }}
            title='Xác nhận'
            content={`Bạn có chắc chắn muốn cập nhật thông tin này không?`}
          />
          <ConfirmationDialog
            visible={!!successMsg || !!errorMsg}
            setVisible={() => {
              if (successMsg) {
                setSuccessMsg(null);
              }
              if (errorMsg) {
                setErrorMsg(null);
              }
            }}
            notShowCancel={true}
            title='Thông báo'
            content={successMsg || ''}
            onSubmit={() => {
              if (successMsg) {
                setSuccessMsg(null);
                setErrorMsg(null);
                props.navigation.goBack();
              }
              if (errorMsg) {
                setErrorMsg(null);
                setSuccessMsg(null);
              }
            }}
          />
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
