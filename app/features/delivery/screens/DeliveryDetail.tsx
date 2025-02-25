import { ConfirmationDialog } from 'app/shared/components/ConfirmDialog';
import { LoadingScreen } from 'app/shared/components/LoadingScreen';
import { SlideButton } from 'app/shared/components/SlideButton';
import { DeliveryStatus, OrderStatus } from 'app/shared/constants/status';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from '../api/delivery.api';
import { DeliverOrderDetail } from 'app/shared/state/delivery.slice';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from 'app/shared/utils/format';
import { getBrandIcon, getPamentMethodIcon } from 'app/shared/utils/getBrandIcon';
import { getErrorMessage } from 'app/shared/utils/helper';
import { shortenUUID } from 'app/shared/utils/order';
import { DeliveryStackParamList } from 'app/shared/types/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Divider, IconButton, Portal, Text } from 'react-native-paper';

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
  const [err, setErr] = useState('');
  const [isStartDeliSwipe, setIsStartDeliSwipe] = useState(false);
  const [isCancelDeli, setIsCancelDeli] = useState(false);
  const [updateDeliveryStatus, { isLoading: isUpdating }] = useUpdateDeliveryStatusMutation();

  const deliveryInfo = useMemo(
    () => [
      {
        title: 'Mã chuyến đi',
        value: shortenUUID(deliveryId, 'DELIVERY')
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
    navigation.navigate('StaffTrackOrder', {
      order: currentOrder as unknown as DeliverOrderDetail
    });
  }, [currentOrder]);
  console.log('currentOrder', currentOrder);
  console.log('delivery[0]', delivery?.orders[0]);
  const onUpdateDelivery = useCallback(
    (status: Omit<DeliveryStatus, 'PENDING'>) => {
      updateDeliveryStatus({ id: deliveryId, status })
        .unwrap()
        .then(() => {
          if (status === DeliveryStatus.FINISHED || status === DeliveryStatus.CANCELED) {
            navigation.goBack();
          } else {
            onTrackOrder();
          }
        })
        .catch((err) => {
          setErr(getErrorMessage(err));
        });
    },
    [deliveryId, currentOrder]
  );

  if (isLoading) {
    return <ActivityIndicator size='large' color='#34A853' />;
  }
  const latestStatus = delivery?.latestStatus;
  if (isUpdating) {
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
              onUpdateDelivery(DeliveryStatus.ACCEPTED);
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
            onUpdateDelivery(DeliveryStatus.CANCELED);
            setIsCancelDeli(false);
          }}
          title='Thông báo'
          content='Bạn có chắc chắn muốn huỷ chuyến đi?'
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
                  canFinishDelivery ? () => onUpdateDelivery(DeliveryStatus.FINISHED) : onTrackOrder
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
              backgroundColor:
                currentOrder !== undefined || canFinishDelivery
                  ? theme.colors.surfaceDisabled
                  : theme.colors.error,
              borderRadius: 8,
              height: 60,
              width: 60
            }}
            iconColor={theme.colors.onError}
            disabled={currentOrder !== undefined || canFinishDelivery}
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
