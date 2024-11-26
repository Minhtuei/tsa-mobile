import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AccountStackParamList } from 'app/types/navigation';
import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Portal } from 'react-native-paper';

import { ChooseImageModal } from '@components/ChooseImageModal';
import { ConfirmationDialog } from '@components/ConfirmDialog';
import { PreViewImageModal } from '@components/PreviewImageModal';
import { BUILDINGS, DOMITORIES, ROOMS } from '@constants/domitory';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  BuildingSelect,
  DormitorySelect,
  FirstNameInput,
  LastNameInput,
  PhoneNumberInput,
  RoomSelect
} from '@pages/auth/components/AuthForm';
import { useUpLoadImageMutation } from '@services/report.service';
import { useUpdateUserInfoMutation } from '@services/user.service';
import { updateAccountSchema, UpdateAccountSchemaType } from '@validations/auth.schema';
import Toast from 'react-native-root-toast';
import { PhotoInput } from './ProfileField';
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

              <DormitorySelect control={control} errors={errors} dormitories={DOMITORIES} />
              <BuildingSelect control={control} errors={errors} buildings={BUILDINGS} />
              <RoomSelect control={control} errors={errors} rooms={ROOMS} />
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
          {(isUpdateProfileLoading || isUploadImageLoading) && (
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                top: 0,
                left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
                width: '100%',
                height: '100%'
              }}
            >
              <ActivityIndicator size='large' color={theme.colors.primary} />
            </View>
          )}
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
