import { ChooseImageModal } from '@components/ChooseImageModal';
import { ConfirmationDialog } from '@components/ConfirmDialog';
import { LoadingScreen } from '@components/LoadingScreen';
import { PreViewImageModal } from '@components/PreviewImageModal';
import { SlideButton } from '@components/SlideButton';
import { OrderStatus } from '@constants/status';
import { FontAwesome } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@hooks/redux';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useUpdateOrderStatusMutation } from '@services/order.service';
import { useUpLoadImageMutation } from '@services/report.service';
import { setHideTabBar } from '@slices/app.slice';
import { formatVNDcurrency } from '@utils/format';
import { formatDistance } from '@utils/getDirection';
import { getErrorMessage } from '@utils/helper';
import { shortenUUID } from '@utils/order';
import { updateOrderStatusSchema, UpdateOrderStatusSchemaType } from '@validations/order.schema';
import { DeliveryStackParamList } from 'app/types/navigation';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { IconButton, Portal, Text } from 'react-native-paper';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { FinishedImageInput } from '../components/DeliveryField';
import { StaffOrderMap } from './StaffOrderMap';
export const StaffTrackOrder = (
  props: NativeStackScreenProps<DeliveryStackParamList, 'StaffTrackOrder'>
) => {
  const order = props.route.params.order;
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [isComplete, setIsComplete] = useState(false);
  const [isErr, setIsErr] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isShowCamera, setIsShowCamera] = useState(false);

  const snapPoints = useMemo(() => ['50%'], []);
  const dispatch = useAppDispatch();
  const [distance, setDistance] = useState<string | null>(null);

  const [finishOrder, { isLoading: isFinishOrderLoading }] = useUpdateOrderStatusMutation();
  const [uploadImage] = useUpLoadImageMutation();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(updateOrderStatusSchema),
    defaultValues: {
      status: OrderStatus.DELIVERED as string,
      finishedImage: '',
      distance: 0
    }
  });
  // Captured image state
  const finishedImage = watch('finishedImage');
  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [fileType, setFileType] = useState<string | null | undefined>(null);
  const onSubmit = async (data: UpdateOrderStatusSchemaType) => {
    if (fileName && fileType) {
      try {
        const formData = new FormData();
        const file = {
          uri: data.finishedImage,
          name: fileName,
          type: fileType
        } as any;
        formData.append('image', file);
        // const result = await uploadImage(formData).unwrap();
        const validateData = {
          status: OrderStatus.DELIVERED,
          distance: data.distance,
          finishedImage: 'result.url',
          orderId: order.id
        };
        await finishOrder(validateData).unwrap();
        props.navigation.goBack();
      } catch (error) {
        setIsErr(getErrorMessage(error));
      }
    }
  };
  useEffect(() => {
    if (distance) {
      setValue('distance', Number(distance));
    }
  }, [distance]);
  useEffect(() => {
    dispatch(setHideTabBar(true));
    return () => {
      dispatch(setHideTabBar(false));
    };
  }, [dispatch]);
  return (
    <View style={styles.page}>
      <Portal>
        <ConfirmationDialog
          visible={isComplete}
          setVisible={() => {
            setIsComplete(false);
          }}
          onSubmit={handleSubmit(onSubmit)}
          title='Xác nhận hoàn thành'
          content={'Bạn có chắc chắn muốn hoàn thành đơn hàng này?'}
          renderContent={() => (
            <>
              <Text
                style={[
                  globalStyles.text,
                  { color: theme.colors.error, fontSize: 14, fontStyle: 'italic' }
                ]}
              >
                *Vui lòng chụp ảnh đơn hàng trước khi hoàn thành
              </Text>
              <FinishedImageInput
                control={control}
                errors={errors}
                setViewImageModalVisible={setIsPreview}
                setProofModalVisible={setIsShowCamera}
              />
            </>
          )}
        />
        <ChooseImageModal
          title='Chọn ảnh hoàn thành'
          visible={isShowCamera}
          setVisible={setIsShowCamera}
          forceCamera={isShowCamera}
          onSuccess={({ uri, name, type }) => {
            setValue('finishedImage', uri);
            setFileName(name);
            setFileType(type);
          }}
        />
        <PreViewImageModal
          visible={isPreview}
          setVisible={setIsPreview}
          proofUri={finishedImage}
          setValue={(field, value) => setValue('finishedImage', value)}
          title='Ảnh hoàn thành'
        />
        <ConfirmationDialog
          visible={Boolean(isErr)}
          setVisible={() => {
            setIsErr('');
          }}
          title='Lỗi'
          notShowCancel={true}
          content={isErr}
          onSubmit={() => {
            setIsErr('');
          }}
        />

        {isFinishOrderLoading && <LoadingScreen />}
      </Portal>
      <StaffOrderMap order={order} setDistance={setDistance} />
      <BottomSheet index={1} snapPoints={snapPoints}>
        <BottomSheetView style={{ padding: 12, gap: 8 }}>
          <View
            style={[
              {
                padding: 16,
                borderRadius: 8,
                gap: 8,
                borderWidth: 1
              }
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {order.studentInfo.photoUrl ? (
                  <Image
                    source={{ uri: order.studentInfo.photoUrl }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <FontAwesome name='user' size={24} color='white' />
                )}
              </View>
              <Text
                style={[
                  globalStyles.text,

                  {
                    fontWeight: 'bold',
                    flex: 1,
                    marginLeft: 8,
                    fontSize: 20
                  }
                ]}
              >
                {order.studentInfo.firstName} {order.studentInfo.lastName}
              </Text>
              <IconButton
                icon={'phone'}
                size={24}
                onPress={() => {
                  Linking.openURL(`tel:${order.studentInfo.phoneNumber}`);
                }}
                mode='outlined'
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Text style={[globalStyles.title, { fontSize: 20 }]}>
                {' '}
                {shortenUUID(order.id, 'ORDER')}
              </Text>
              <Text
                style={[
                  globalStyles.text,
                  {
                    color: theme.colors.outline,
                    marginLeft: 'auto'
                  }
                ]}
              >
                {formatDistance(distance ?? '0')}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Sàn thương mại</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {order.brand}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Sản phẩm</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {order.product}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Cân nặng</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {order.weight} kg
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Địa chỉ</Text>
              <Text
                style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}
              >{`${order.building} - ${order.room}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Thời gian:</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {moment.unix(Number(order.deliveryDate)).format('HH:mm DD/MM/YYYY') ?? 'N/A'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Giá tiền:</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {formatVNDcurrency(order.paymentMethod === 'CASH' ? order.shippingFee || 0 : 0)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={{ flex: 0.95 }}>
              <SlideButton
                title='Hoàn thành đơn hàng'
                onSlideComplete={() => setIsComplete(true)}
              />
            </View>
            <IconButton
              icon={'trash-can-outline'}
              size={24}
              onPress={() => {}}
              mode='contained'
              style={{
                backgroundColor: theme.colors.error,
                borderRadius: 8,
                height: 60,
                width: 60
              }}
              iconColor={theme.colors.onError}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1
  }
});

export default StaffTrackOrder;
