import { ChooseImageModal } from '@components/ChooseImageModal';
import { PreViewImageModal } from '@components/PreviewImageModal';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocationPermission } from '@hooks/location';
import { useAppDispatch } from '@hooks/redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setCurrentOrderId } from '@slices/app.slice';
import { useUpLoadImageMutation } from 'app/features/report/api/report.api';
import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { LoadingScreen } from 'app/shared/components/LoadingScreen';
import { SlideButton } from 'app/shared/components/SlideButton';
import { DeliveryStatus, OrderStatus } from 'app/shared/constants/status';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { DeliverOrderDetail } from 'app/shared/state/delivery.slice';
import { DeliveryStackParamList } from 'app/shared/types/navigation';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'app/shared/utils/format';
import { getBrandIcon, getPamentMethodIcon } from 'app/shared/utils/getBrandIcon';
import { getErrorMessage } from 'app/shared/utils/helper';
import { shortenUUID } from 'app/shared/utils/order';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Divider, IconButton, Portal, Text } from 'react-native-paper';
import { useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from '../api/delivery.api';
import { CanceledImageInput, ReasonInput } from '../components/DeliveryField';
import {
  UpdateDeliverStatusSchema,
  UpdateDeliverStatusSchemaType
} from '../schema/delivery.schema';

type DeliveryDetailProps = NativeStackScreenProps<DeliveryStackParamList, 'DeliveryDetail'>;

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const theme = useAppTheme();
  const {
    data: delivery,
    isLoading,
    refetch,
    isFetching
  } = useGetDeliveryQuery(deliveryId, {
    refetchOnMountOrArgChange: true
  });

  const { permissionGranted, requestPermission } = useLocationPermission();
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

  const [err, setErr] = useState('');
  const [isStartDeliSwipe, setIsStartDeliSwipe] = useState(false);
  const [isCancelDeli, setIsCancelDeli] = useState(false);
  const [updateDeliveryStatus, { isLoading: isUpdating }] = useUpdateDeliveryStatusMutation();
  const [uploadImage, { isLoading: isUploadImageLoading }] = useUpLoadImageMutation();

  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const [fileType, setFileType] = useState<string | null | undefined>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isShowCamera, setIsShowCamera] = useState(false);
  const globalStyles = useGlobalStyles();
  const dispatch = useAppDispatch();
  const canCancel = !(delivery?.latestStatus === 'PENDING');
  const deliveryInfo = useMemo(
    () => [
      {
        title: 'Mã chuyến đi',
        value: delivery?.displayId
      },
      {
        title: 'Thời gian tạo',
        value: formatDate(formatUnixTimestamp(delivery?.createdAt as string))
      },
      {
        title: 'Số lượng đơn hàng',
        value: delivery?.numberOrder
      }
    ],
    [delivery]
  );
  const currentOrder = useMemo(() => {
    if (!delivery) {
      return undefined;
    }
    const order = delivery.orders.find((order) => order.latestStatus === OrderStatus.IN_TRANSPORT);
    return order ? order : delivery.orders[0];
  }, [delivery]);

  const canFinishDelivery = useMemo(() => {
    if (!delivery) {
      return false;
    }
    return delivery.orders.every((order) => order.latestStatus === OrderStatus.DELIVERED);
  }, [delivery]);

  const onSlideComplete = useCallback(() => {
    setIsStartDeliSwipe(true);
  }, []);
  const onTrackOrder = useCallback(() => {
    if (!permissionGranted) {
      setOpenPermissionDialog(true);
      return;
    }
    navigation.navigate('StaffTrackOrder', {
      order: currentOrder as unknown as DeliverOrderDetail
    });
  }, [currentOrder, permissionGranted]);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(UpdateDeliverStatusSchema),
    defaultValues: {
      status: DeliveryStatus.ACCEPTED,
      canceledImage: undefined,
      reason: undefined
    }
  });
  const canceledImage = watch('canceledImage');
  const onSubmit = async (data: UpdateDeliverStatusSchemaType) => {
    try {
      let result = null;
      if (fileName && fileType) {
        const formData = new FormData();
        const file = {
          uri: data.canceledImage,
          name: fileName,
          type: fileType
        } as any;
        formData.append('image', file);
        result = await uploadImage(formData).unwrap();
      }
      const validateData = {
        id: deliveryId,
        status: data.status,
        ...(data.status === DeliveryStatus.CANCELED && {
          reason: data.reason,
          canceledImage: result ? result.url : undefined
        })
      };
      console.log(validateData);
      await updateDeliveryStatus(validateData).unwrap();
      if (data.status === DeliveryStatus.FINISHED || data.status === DeliveryStatus.CANCELED) {
        dispatch(setCurrentOrderId(null));
      }
    } catch (error) {
      console.log(error);
      setErr(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (delivery?.id) {
      setValue('id', delivery.id);
    }
  }, [delivery?.id]);

  if (isLoading) {
    return <ActivityIndicator size='large' color='#34A853' />;
  }
  const latestStatus = delivery?.latestStatus;
  if (isUpdating || isUploadImageLoading) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.rootContainer}>
      <Portal>
        {latestStatus === DeliveryStatus.PENDING && (
          <ConfirmationDialog
            visible={isStartDeliSwipe}
            setVisible={() => {
              setIsStartDeliSwipe(false);
            }}
            onSubmit={() => {
              setValue('status', DeliveryStatus.ACCEPTED);
              handleSubmit(onSubmit)();
            }}
            title='Thông báo'
            content='Bạn có chắc chắn muốn bắt đầu chuyến đi?'
          />
        )}
        <ConfirmationDialog
          visible={isCancelDeli}
          setVisible={() => {
            setIsCancelDeli(false);
          }}
          onSubmit={() => {
            setValue('status', DeliveryStatus.CANCELED);
            handleSubmit(onSubmit)();
          }}
          title='Thông báo'
          content='Bạn có chắc chắn muốn huỷ chuyến đi?'
          renderContent={() => (
            <View style={{ gap: 6 }}>
              <ReasonInput control={control} errors={errors} />

              <Text
                style={[
                  globalStyles.text,
                  { color: theme.colors.error, fontSize: 14, fontStyle: 'italic' }
                ]}
              >
                *Vui lòng chụp ảnh minh chứng trước khi huỷ
              </Text>
              <CanceledImageInput
                control={control}
                errors={errors}
                setViewImageModalVisible={setIsPreview}
                setProofModalVisible={setIsShowCamera}
              />
              <Text
                style={[
                  globalStyles.text,
                  { color: theme.colors.error, fontSize: 14, fontStyle: 'italic' }
                ]}
              >
                *Lưu ý rằng khi huỷ chuyến đi đồng nghĩa với việc huỷ toàn bộ đơn hàng trong chuyến
                đi này. Xin hãy cân nhắc trước khi xác nhận!
              </Text>
            </View>
          )}
        />
        <ChooseImageModal
          title='Chọn ảnh hoàn thành'
          visible={isShowCamera}
          setVisible={setIsShowCamera}
          forceCamera={isShowCamera}
          onSuccess={({ uri, name, type }) => {
            setValue('canceledImage', uri);
            setFileName(name);
            setFileType(type);
          }}
        />
        <PreViewImageModal
          visible={isPreview}
          setVisible={setIsPreview}
          proofUri={canceledImage}
          setValue={(field, value) => setValue('canceledImage', value)}
          title='Ảnh hoàn thành'
        />
        <ConfirmationDialog
          visible={!!err}
          setVisible={() => {
            setErr('');
          }}
          onSubmit={() => {
            setErr('');
          }}
          title='Lỗi'
          content={err}
          notShowCancel
          isErr
        />
        <ConfirmationDialog
          visible={openPermissionDialog}
          setVisible={() => {
            setOpenPermissionDialog(false);
          }}
          onSubmit={() => {
            Linking.openSettings();
            requestPermission();
            setOpenPermissionDialog(false);
          }}
          title='Thông báo'
          content='Vui lòng cấp quyền truy cập vị trí và khởi động lại ứng dụng để sử dụng tính năng này.'
          notShowCancel
        />
      </Portal>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      >
        <View style={styles.container}>
          <Card elevation={4} style={{ backgroundColor: theme.colors.surface }}>
            <Card.Content>
              <Text style={styles.headerText}>Thông tin chung</Text>
              <View style={styles.infoContainer}>
                {deliveryInfo.map((info, index) => (
                  <View key={index} style={styles.infoRow}>
                    <Text style={styles.infoTitle}>{info.title}</Text>
                    <Text>{info.value}</Text>
                  </View>
                ))}
              </View>
            </Card.Content>
          </Card>
          <View style={styles.orderListHeader}>
            <Feather name='box' size={24} color='green' />
            <Text style={styles.orderListHeaderText}>Danh sách đơn hàng</Text>
          </View>
          <View style={styles.orderListContainer}>
            {delivery?.orders.map((order, index) => {
              const isFinished = order.latestStatus === OrderStatus.DELIVERED;
              const isCanceled = order.latestStatus === OrderStatus.CANCELED;
              const isDelivering =
                order.id === currentOrder?.id &&
                currentOrder?.latestStatus === OrderStatus.IN_TRANSPORT;
              return (
                <Card
                  elevation={2}
                  key={index}
                  style={{
                    backgroundColor: isDelivering
                      ? theme.colors.surface
                      : isFinished
                        ? theme.colors.surfaceVariant
                        : isCanceled
                          ? theme.colors.error
                          : theme.colors.surfaceVariant
                  }}
                  onPress={() => {
                    navigation.navigate('StaffTrackOrder', {
                      order: order as unknown as DeliverOrderDetail
                    });
                  }}
                  disabled={
                    isFinished ||
                    isCanceled ||
                    latestStatus === OrderStatus.PENDING ||
                    currentOrder?.id !== order.id
                  }
                >
                  <Card.Content>
                    <Text style={styles.orderCode}>
                      Mã Đơn hàng: {shortenUUID(order.id, 'ORDER')}
                    </Text>
                    <View style={styles.orderDetails}>
                      <View style={styles.orderInfo}>
                        {order.brand ? (
                          <Image
                            source={getBrandIcon(order.brand)}
                            style={{ width: 48, height: 48 }}
                          />
                        ) : (
                          <View style={styles.iconContainer}>
                            <FontAwesome name='shopping-cart' size={24} color='white' />
                          </View>
                        )}
                        <View style={styles.orderTextContainer}>
                          <Text>{order.product}</Text>
                          <Text>
                            P.{order.room}, T.{order.building}, KTX khu {order.dormitory}
                          </Text>
                        </View>
                      </View>

                      <Image
                        source={getPamentMethodIcon(order.paymentMethod)}
                        style={{ width: 48, height: 48 }}
                      />
                    </View>
                    <Divider style={styles.divider} />
                    <View style={styles.orderFooter}>
                      <Text>{formatDate(formatUnixTimestamp(order.deliveryDate))}</Text>
                      <Text>{formatVNDcurrency(order.shippingFee)}</Text>
                      <AntDesign name='rightcircleo' size={24} color='black' />
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
      {latestStatus !== DeliveryStatus.FINISHED && latestStatus !== DeliveryStatus.CANCELED && (
        <View style={{ flexDirection: 'row', paddingVertical: 16, alignItems: 'center' }}>
          <View style={{ flex: 0.95 }}>
            {latestStatus === DeliveryStatus.PENDING ? (
              <SlideButton onSlideComplete={onSlideComplete} title='Bắt đầu chuyến đi' />
            ) : (
              <Button
                mode='contained'
                onPress={
                  canFinishDelivery
                    ? () => {
                        setValue('status', DeliveryStatus.FINISHED);
                        handleSubmit(onSubmit)();
                      }
                    : onTrackOrder
                }
                style={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 8,
                  height: 60,
                  width: '90%',
                  alignSelf: 'center',
                  justifyContent: 'center'
                }}
              >
                {canFinishDelivery ? 'Hoàn thành chuyến đi' : 'Đến bước hiện tại'}
              </Button>
            )}
          </View>
          <IconButton
            icon={'trash-can-outline'}
            size={24}
            onPress={() => {
              setIsCancelDeli(true);
            }}
            mode='contained'
            style={{
              backgroundColor: canCancel ? theme.colors.error : theme.colors.outlineVariant,

              borderRadius: 8,
              height: 60,
              width: 60
            }}
            iconColor={canCancel ? theme.colors.onError : theme.colors.background}
            disabled={!canCancel}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingBottom: 90
  },
  scrollContainer: {
    padding: 16
  },
  container: {
    flex: 1
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'blue'
  },
  infoContainer: {
    flexDirection: 'column',
    gap: 5
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoTitle: {
    fontWeight: 'bold'
  },
  orderListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginVertical: 16
  },
  orderListHeaderText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'green'
  },
  orderListContainer: {
    flexDirection: 'column',
    gap: 16
  },
  orderCode: {
    fontWeight: 'bold',
    fontSize: 18
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  orderTextContainer: {
    flexDirection: 'column',
    gap: 8
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center'
  },
  momoContainer: {
    width: 48,
    height: 48,
    borderRadius: 30,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center'
  },
  momoText: {
    color: 'white'
  },
  divider: {
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  orderFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circleButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default DeliveryDetail;
