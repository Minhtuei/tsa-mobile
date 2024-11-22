import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Divider, Text, Card } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeliveryStackParamList } from 'app/types/navigation';
import { useGetDeliveryQuery } from '@services/delivery.service';
import { Feather, AntDesign, FontAwesome } from '@expo/vector-icons';
import { formatUnixTimestamp, formatDate, formatVNDcurrency } from '@utils/format';
import { useSocketContext } from 'socket';
import { Order } from 'app/types/order';

type DeliveryDetailProps = NativeStackScreenProps<DeliveryStackParamList, 'DeliveryDetail'>;

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const { data: delivery, isLoading } = useGetDeliveryQuery(deliveryId);
  const [location, setLocation] = useState<any>();
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;

    const intervalId = setInterval(() => {
      socket.emit('locationUpdate', {
        staffId: 'cm1isbgcl00008mcgm7dzftgc',
        orderId: 'cm3pf1jvt0001zb1n16nch6p1',
        latitude: 106.806709613827,
        longitude: 10.877568988757174
      });
    }, 5000); // Send location update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [socket]);

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

  if (isLoading) {
    return <ActivityIndicator size='large' color='#34A853' />;
  }

  return (
    <View style={styles.rootContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Card>
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
            {delivery?.orders.map((order, index) => (
              <Card key={index}>
                <Card.Content>
                  <Text style={styles.orderCode}>Mã Đơn hàng: #{order.checkCode}</Text>
                  <View style={styles.orderDetails}>
                    <View style={styles.orderInfo}>
                      <View style={styles.iconContainer}>
                        <Feather name='box' size={24} color='black' />
                      </View>
                      <View style={styles.orderTextContainer}>
                        <Text>{order.product}</Text>
                        <Text>
                          P.{order.room}, T.{order.building}, KTX khu {order.dormitory}
                        </Text>
                      </View>
                    </View>
                    {order.paymentMethod === 'CASH' ? (
                      <FontAwesome name='money' size={24} color='black' />
                    ) : order.paymentMethod === 'CREDIT' ? (
                      <AntDesign name='creditcard' size={24} color='black' />
                    ) : (
                      <View style={styles.momoContainer}>
                        <Text style={styles.momoText}>MOMO</Text>
                      </View>
                    )}
                  </View>
                  <Divider style={styles.divider} />
                  <View style={styles.orderFooter}>
                    <Text>{formatDate(formatUnixTimestamp(order.deliveryDate))}</Text>
                    <Text>{formatVNDcurrency(order.shippingFee)}</Text>
                    <AntDesign name='rightcircleo' size={24} color='black' />
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.circleButton}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('StaffTrackOrder', {
              order: delivery?.orders[0] as unknown as Order
            });
          }}
        >
          <Text style={styles.circleButtonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
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
    marginVertical: 8
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
    bottom: 16,
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
