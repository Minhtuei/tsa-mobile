import { yupResolver } from '@hookform/resolvers/yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { MainTabParamList, ReportStackParamList } from 'app/shared/types/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Portal } from 'react-native-paper';

import { CompositeScreenProps } from '@react-navigation/native';
import { getErrorMessage } from '@utils/helper';
import {
  createReportSchema,
  CreateReportSchemaType
} from 'app/features/report/schema/report.schema';
import { ChooseImageModal } from 'app/shared/components/ChooseImageModal';
import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { PreViewImageModal } from 'app/shared/components/PreviewImageModal';
import { useAppSelector } from 'app/shared/hooks/redux';
import Toast from 'react-native-root-toast';
import { useCreateReportMutation, useUpLoadImageMutation } from '../api/report.api';
import { ContentInput, OrderIdInput, ProofInput } from '../components/ReportField';
export const CreateReport = (
  props: CompositeScreenProps<
    NativeStackScreenProps<ReportStackParamList, 'CreateReport'>,
    NativeStackScreenProps<MainTabParamList, 'Order'>
  >
) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const [visible, setVisible] = useState(false);
  const [proofModalVisible, setProofModalVisible] = useState(false);
  const [viewImageModalVisible, setViewImageModalVisible] = useState(false);
  const [createReport, { isLoading: isCreateReportLoading }] = useCreateReportMutation();
  const [uploadImage, { isLoading: isUploadImageLoading }] = useUpLoadImageMutation();

  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [fileType, setFileType] = useState<string | null | undefined>(null);
  const auth = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue
  } = useForm<CreateReportSchemaType>({
    resolver: yupResolver(createReportSchema),
    defaultValues: {
      content: '',
      proof: '',
      orderId: props.route.params?.orderId || '',
      reportedAt: String(Math.floor(Date.now() / 1000)),
      repliedAt: '',
      reply: '',
      studentId: auth.userInfo?.id || ''
    }
  });

  const onSubmit = async (data: CreateReportSchemaType) => {
    if (fileName && fileType) {
      try {
        const formData = new FormData();
        const file = {
          uri: data.proof,
          name: fileName,
          type: fileType
        } as any;
        formData.append('image', file);
        const result = await uploadImage(formData).unwrap();
        const validateData = {
          ...data,
          proof: result.url
        };
        await createReport(validateData).unwrap();
        Toast.show('Tạo khiếu nại thành công', {
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: theme.colors.success,
          textColor: theme.colors.onSuccess
        });
        props.navigation.navigate('ReportList');
      } catch (error) {
        Toast.show(getErrorMessage(error), {
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <View style={{ gap: 24 }}>
            <View style={[globalStyles.vstack, { gap: 24 }]}>
              {/* <OrderIdInput
                control={control}
                errors={errors}
                defaultValue={props.route.params?.orderId}
                disabled={isUploadImageLoading || isCreateReportLoading}
                // onPress={() => {
                //   const foundOrder = orders?.find((order) => order.id === watch('orderId'));
                //   if (foundOrder)
                //     props.navigation.navigate('Order', {
                //       screen: 'OrderDetail',
                //       params: { order: foundOrder }
                //     });
                // }}
              /> */}
              <ContentInput control={control} errors={errors} />
              <ProofInput
                control={control}
                errors={errors}
                setProofModalVisible={setProofModalVisible}
                setViewImageModalVisible={setViewImageModalVisible}
              />
            </View>
            <Button
              onPress={() => setVisible(true)}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              style={{ width: '100%' }}
              loading={isCreateReportLoading || isUploadImageLoading}
              disabled={isCreateReportLoading || isUploadImageLoading}
            >
              Tạo khiếu nại
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
            title='Ảnh minh chứng'
          />
          <ConfirmationDialog
            visible={visible}
            setVisible={setVisible}
            onSubmit={handleSubmit(onSubmit)}
            title='Xác nhận'
            content='Bạn có chắc chắn muốn tạo khiếu nại này không?'
          />
        </Portal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
