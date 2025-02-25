import { yupResolver } from '@hookform/resolvers/yup';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ReportStackParamList } from 'app/shared/types/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Portal, Text, TextInput } from 'react-native-paper';

import { ChooseImageModal } from 'app/shared/components/ChooseImageModal';
import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { PreViewImageModal } from 'app/shared/components/PreviewImageModal';
import { useAppSelector } from 'app/shared/hooks/redux';
import {
  createReportSchema,
  CreateReportSchemaType
} from 'app/features/report/schema/report.schema';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import {
  useDeleteReportMutation,
  useUpdateReportMutation,
  useUpLoadImageMutation
} from '../api/report.api';
import { ContentInput, ProofInput } from '../components/ReportField';
export const ReportDetail = (
  props: NativeStackScreenProps<ReportStackParamList, 'ReportDetail'>
) => {
  const { report } = props.route.params;
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const auth = useAppSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [viewImageModalVisible, setViewImageModalVisible] = useState(false);
  const [uploadImage, { isLoading: isUploadImageLoading }] = useUpLoadImageMutation();
  const [updateReport, { isLoading: isUpdateReportLoading }] = useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleteReportLoading }] = useDeleteReportMutation();
  const [actionType, setActionType] = useState<'UPDATE' | 'DELETE'>('UPDATE');
  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [fileType, setFileType] = useState<string | null | undefined>(null);
  const [isEdit, setIsEdit] = useState(false);
  const canNotEdit = report.status === 'REPLIED';
  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    reset
  } = useForm<CreateReportSchemaType>({
    resolver: yupResolver(createReportSchema),
    defaultValues: {
      content: report.content,
      proof: report.proof,
      orderId: report.orderId,
      reportedAt: report.reportedAt,
      repliedAt: report.repliedAt,
      reply: report.reply,
      studentId: auth.userInfo?.id || ''
    }
  });
  const canUpdate = report.content !== watch('content') || report.proof !== watch('proof');
  const onSubmit = async (data: CreateReportSchemaType) => {
    if (isEdit && canUpdate && data.proof) {
      try {
        let proofUri = data.proof;
        if (data.proof !== report.proof) {
          const formData = new FormData();
          const file = {
            uri: data.proof,
            name: fileName,
            type: fileType
          } as any;
          formData.append('image', file);
          const result = await uploadImage(formData).unwrap();
          proofUri = result.url;
        }

        const validateData = {
          ...data,
          proof: proofUri
        };

        await updateReport({ report: validateData, reportId: report.id }).unwrap();
        Toast.show('Cập nhật khiếu nại thành công', {
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: theme.colors.success,
          textColor: theme.colors.onSuccess
        });
        setIsEdit(false);
      } catch (error) {
        Toast.show('Tạo khiếu nại thất bại', {
          position: Toast.positions.CENTER,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.onError
        });
      }
    }
  };

  const onDeleteReport = async () => {
    try {
      await deleteReport(report.id).unwrap();
      Toast.show('Xóa khiếu nại thành công', {
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.success,
        textColor: theme.colors.onSuccess
      });
      props.navigation.navigate('ReportList');
    } catch (error) {
      Toast.show('Xóa khiếu nại thất bại', {
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.error,
        textColor: theme.colors.onError
      });
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
        style={{ flex: 1 }}
        contentContainerStyle={[
          { flex: 1, paddingBottom: 32, backgroundColor: theme.colors.background }
        ]}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ gap: 24 }}>
            <View style={[globalStyles.vstack, { gap: 24 }]}>
              <View style={{ width: '100%', gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                    Mã đơn hàng
                  </Text>
                  <Button
                    mode='text'
                    onPress={() => {
                      setIsEdit(true);
                    }}
                    icon={'pencil'}
                    disabled={canNotEdit}
                  >
                    Sửa
                  </Button>
                </View>
                <TextInput
                  value={watch('orderId')}
                  style={{
                    backgroundColor: theme.colors.surfaceDisabled,
                    borderRadius: 0,
                    borderWidth: 1,
                    borderColor: theme.colors.outline
                  }}
                  editable={false}
                />
              </View>

              <ContentInput control={control} errors={errors} disable={!isEdit} />
              {canNotEdit && (
                <View style={{ width: '100%', gap: 8 }}>
                  <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                    Phản hồi
                  </Text>
                  <TextInput
                    value={report.reply!}
                    style={{
                      backgroundColor: theme.colors.surfaceDisabled,
                      borderRadius: 0,
                      borderWidth: 1,
                      borderColor: theme.colors.outline
                    }}
                    editable={false}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              )}
              <ProofInput
                control={control}
                errors={errors}
                setProofModalVisible={setProofModalVisible}
                setViewImageModalVisible={setViewImageModalVisible}
              />
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                  Ngày khiếu nại
                </Text>
                <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                  {moment.unix(Number(watch('reportedAt'))).format(' HH:mm DD/MM/YYYY')}
                </Text>
              </View>
              {canNotEdit && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text style={{ color: theme.colors.onSurface, fontWeight: 'bold', fontSize: 16 }}>
                    Ngày phản hồi
                  </Text>
                  <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                    {moment.unix(Number(watch('repliedAt'))).format(' HH:mm DD/MM/YYYY')}
                  </Text>
                </View>
              )}
            </View>
            {isEdit && (
              <>
                <Button
                  onPress={() => {
                    setActionType('UPDATE');
                    setVisible(true);
                  }}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.onPrimary}
                  style={{ width: '80%', marginHorizontal: 'auto' }}
                  loading={isUpdateReportLoading}
                  disabled={
                    isUploadImageLoading ||
                    !canUpdate ||
                    isUpdateReportLoading ||
                    isDeleteReportLoading
                  }
                  icon={'check'}
                >
                  Cập nhật
                </Button>
                <Button
                  onPress={() => {
                    setIsEdit(false);
                    reset();
                  }}
                  buttonColor={theme.colors.secondary}
                  textColor={theme.colors.onSecondary}
                  style={{ width: '80%', marginHorizontal: 'auto' }}
                  loading={isUploadImageLoading}
                  disabled={isUploadImageLoading || isUpdateReportLoading || isDeleteReportLoading}
                  icon={'cancel'}
                >
                  Huỷ bỏ
                </Button>
              </>
            )}

            <Button
              onPress={() => {
                setActionType('DELETE');
                setVisible(true);
              }}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              style={{ width: '80%', marginHorizontal: 'auto' }}
              loading={isDeleteReportLoading}
              disabled={isUploadImageLoading || isUpdateReportLoading || isDeleteReportLoading}
              icon={'trash-can'}
            >
              Gỡ khiếu nại
            </Button>
          </View>
        </View>
        <Portal>
          <ChooseImageModal
            title='Chọn ảnh minh chứng'
            visible={proofModalVisible}
            setVisible={setProofModalVisible}
            onSuccess={({ uri, name, type }) => {
              setValue('proof', uri);
              setFileName(name);
              setFileType(type);
            }}
          />
          <PreViewImageModal
            visible={viewImageModalVisible}
            setVisible={setViewImageModalVisible}
            proofUri={watch('proof')}
            setValue={(field, value) => setValue('proof', value)}
            disabled={!isEdit}
            title='Ảnh minh chứng'
          />
          <ConfirmationDialog
            visible={visible}
            setVisible={setVisible}
            onSubmit={() => {
              if (actionType === 'DELETE') {
                onDeleteReport();
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            title='Xác nhận'
            content={`Bạn có chắc chắn muốn ${actionType === 'UPDATE' ? 'cập nhật' : 'xóa'} khiếu nại này không?`}
          />
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
