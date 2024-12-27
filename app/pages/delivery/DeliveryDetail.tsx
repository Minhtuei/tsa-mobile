import { ConfirmationDialog } from '@components/ConfirmDialog';
import { SlideButton } from '@components/SlideButton';
import { DeliveryStatus } from 'app/types/delivery';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetDeliveryQuery, useUpdateDeliveryStatusMutation } from '@services/delivery.service';
import { formatDate, formatUnixTimestamp, formatVNDcurrency } from '@utils/format';
import { getBrandIcon, getPamentMethodIcon } from '@utils/getBrandIcon';
import { getErrorMessage } from '@utils/helper';
import { DeliveryStackParamList } from 'app/types/navigation';
import { Order } from 'app/types/order';
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
import { LoadingScreen } from '@components/LoadingScreen';
import { OrderStatus } from '@constants/status';
import { DeliverOrderDetail } from '@slices/delivery.slice';
import { shortenUUID } from '@utils/order';

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
        title: 'Thời gian tạo',
        value: formatDate(formatUnixTimestamp(delivery?.createdAt as string))
      },
      {
        title: 'Số lượng đơn hàng',
        value: delivery?.orders.length
      },
      {
        title: 'Thời gian giới hạn',
        value: `${delivery?.limitTime} giây`
      }
    ],
    [delivery]
  );
  const currentOrder = useMemo(() => {
    if (!delivery) {
      return undefined;
    }
    return delivery.orders.find((order) => order.latestStatus === OrderStatus.IN_TRANSPORT);
  }, [delivery]);

  const onSlideComplete = useCallback(() => {
    setIsStartDeliSwipe(true);
  }, []);
  const onTrackOrder = useCallback(() => {
    navigation.navigate('StaffTrackOrder', {
      order: currentOrder as unknown as DeliverOrderDetail
    });
  }, [currentOrder]);
  const onUpdateDelivery = useCallback(
    (status: Omit<DeliveryStatus, 'PENDING'>) => {
      updateDeliveryStatus({ id: deliveryId, status })
        .unwrap()
        .then(() => {
          onTrackOrder();
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
  const latestStatus = delivery?.DeliveryStatusHistory[1]?.status;
  if (isUpdating) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.rootContainer}>
      <Portal>
        {latestStatus === 'PENDING' && (
          <ConfirmationDialog
            visible={isStartDeliSwipe}
            setVisible={() => {
              setIsStartDeliSwipe(false);
            }}
            onSubmit={() => {
              onUpdateDelivery('ACCEPTED');
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
            onUpdateDelivery('CANCELLED');
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
              const isFinished =
                order.latestStatus === 'DELIVERED' || currentOrder?.id !== order.id;
              const isCanceled = order.latestStatus === 'CANCELED';
              return (
                <Card
                  elevation={2}
                  key={index}
                  style={{
                    backgroundColor: isFinished
                      ? theme.colors.surfaceVariant
                      : isCanceled
                        ? theme.colors.errorContainer
                        : theme.colors.surface
                  }}
                  onPress={() => {
                    navigation.navigate('StaffTrackOrder', {
                      order: order as unknown as DeliverOrderDetail
                    });
                  }}
                  disabled={
                    isFinished ||
                    isCanceled ||
                    latestStatus === 'PENDING' ||
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
      <View style={{ flexDirection: 'row', paddingVertical: 16, alignItems: 'center' }}>
        <View style={{ flex: 0.95 }}>
          {latestStatus === 'PENDING' ? (
            <SlideButton onSlideComplete={onSlideComplete} title='Bắt đầu chuyến đi' />
          ) : (
            <Button
              mode='contained'
              onPress={onTrackOrder}
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: 8,
                height: 60,
                width: '90%',
                alignSelf: 'center',
                justifyContent: 'center'
              }}
            >
              Đến bước hiện tại
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
            backgroundColor: theme.colors.error,
            borderRadius: 8,
            height: 60,
            width: 60
          }}
          iconColor={theme.colors.onError}
        />
      </View>
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
