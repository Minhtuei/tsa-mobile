import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SCREEN } from 'app/shared/constants/screen';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { MainTabParamList, OrderStackParamList } from 'app/shared/types/navigation';
import {
  formatDate,
  formatTimeslotFromTimestamp,
  formatUnixTimestamp,
  formatVNDcurrency
} from 'app/shared/utils/format';
import { getStatusRender, shortenUUID } from 'app/shared/utils/order';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Button, IconButton, Portal, Text } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { OrderStatus } from '@constants/status';
import { PreViewImageModal } from '@components/PreviewImageModal';
import moment from 'moment';
export const OrderDetail = (
  props: CompositeScreenProps<
    NativeStackScreenProps<OrderStackParamList, 'OrderDetail'>,
    NativeStackScreenProps<MainTabParamList, 'Account'>
  >
) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const order = props.route.params.order;
  const statusRender = getStatusRender(order.latestStatus);
  const canReport = [
    OrderStatus.CANCELED,
    OrderStatus.DELIVERED,
    OrderStatus.IN_TRANSPORT,
    OrderStatus.REJECTED
  ].includes(order.latestStatus as OrderStatus);

  const formatedTimeslot =
    formatTimeslotFromTimestamp(order.deliveryDate) ??
    formatDate(formatUnixTimestamp(order.deliveryDate));
  const deliveryDate = formatedTimeslot?.split(' ')[0];
  const timeslot = formatedTimeslot?.split(' ')[1];
  const copyToClipboard = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show('Đã sao chép', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: theme.colors.primary,
      textColor: theme.colors.onPrimary
    });
  }, []);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [seeHistory, setSeeHistory] = useState(false);
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        position: 'relative',
        flexGrow: 1,
        paddingBottom: 100
      }}
    >
      <Portal>
        <PreViewImageModal
          visible={modalVisible}
          setVisible={setModalVisible}
          proofUri={selectedImageUri}
          setValue={() => {}}
          disabled={true}
          title='Ảnh minh chứng'
        />
      </Portal>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.primary]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 1.5, y: 1.5 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          width: SCREEN.width,
          height: '100%'
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'transparent',
          paddingHorizontal: 8,
          paddingVertical: 32,
          gap: 32
        }}
      >
        <View
          style={[
            {
              padding: 24,
              borderRadius: 8,
              width: '95%',
              gap: 8,
              position: 'relative'
            },
            globalStyles.SurfaceContainer
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[globalStyles.title, { fontSize: 24 }]}>
              {shortenUUID(order.id, 'ORDER')}
            </Text>
            <IconButton
              style={{
                marginLeft: 'auto'
              }}
              icon='history'
              onPress={() => setSeeHistory((prev) => !prev)}
            />
            <IconButton
              style={{
                marginLeft: 'auto'
              }}
              icon='content-copy'
              onPress={() => copyToClipboard(order.id)}
            />
          </View>
          {order.brand && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '45%' }]}>Sàn thương mại:</Text>
              <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
                {order.brand}
              </Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Checkcode:</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {order.checkCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Sản phẩm</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {order.product}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Địa chỉ</Text>
            <Text
              style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}
            >{`${order.building} - ${order.room}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Trạng thái:</Text>
            <Text
              style={[
                globalStyles.text,
                { width: '55%', color: statusRender.color, textAlign: 'right' }
              ]}
            >
              {statusRender.label}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Ngày giao hàng:</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {deliveryDate}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Thời gian:</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {timeslot}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Giá tiền:</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {formatVNDcurrency(order.shippingFee || 0)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '45%' }]}>Phương thức thanh toán:</Text>
            <Text style={[globalStyles.text, { width: '55%', textAlign: 'right' }]}>
              {order.paymentMethod === 'CASH'
                ? 'Tiền mặt'
                : order.paymentMethod === 'MOMO'
                  ? 'Momo'
                  : 'Qua ngân hàng'}
            </Text>
          </View>
          {!order.isPaid && Boolean(order.remainingAmount) && order.paymentMethod !== 'CASH' && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text style={{ color: theme.colors.error }}>
                Bạn còn nợ: {formatVNDcurrency(order.remainingAmount || 0)} Vui lòng thanh toán
                trước khi nhận hàng để được admin xác nhận
              </Text>
            </View>
          )}
          <View
            style={{
              width: '100%',
              borderTopWidth: 1,
              borderStyle: 'dashed',
              borderColor: 'gray',
              marginVertical: 8
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap'
            }}
          >
            {canReport && (
              <Button
                mode='contained'
                style={[{ backgroundColor: theme.colors.error, minWidth: 60 }]}
                onPress={() => {
                  props.navigation.navigate('Account', {
                    screen: 'Report',
                    params: {
                      screen: 'CreateReport',
                      params: { orderId: order.id }
                    }
                  });
                }}
                icon={'alert-circle'}
              >
                Khiếu nại
              </Button>
            )}
            {!order.isPaid && order.paymentMethod !== 'CASH' && (
              <Button
                mode='contained'
                style={{ minWidth: 60 }}
                onPress={() => {
                  props.navigation.navigate('OrderPayment', { order });
                }}
                icon={'credit-card'}
              >
                Thanh toán
              </Button>
            )}
            {order.latestStatus !== 'DELIVERED' && (
              <Button
                mode='contained'
                style={{ minWidth: 60 }}
                onPress={() => {
                  props.navigation.navigate('TrackOrder', { order: order });
                }}
                icon={'map'}
              >
                Theo dõi
              </Button>
            )}
          </View>
        </View>
        {seeHistory && (
          <View
            style={[
              {
                padding: 24,
                borderRadius: 8,
                width: '95%',
                gap: 8,
                position: 'relative'
              },
              globalStyles.SurfaceContainer
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[globalStyles.title, { fontSize: 20 }]}>
                Lịch sử trạng thái đơn hàng:
              </Text>
            </View>
            {order.historyTime.map((item) => {
              const imageUri =
                item.status === 'DELIVERED' ? order.finishedImage : item.canceledImage;

              return (
                <View
                  key={item.id}
                  style={{
                    marginBottom: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <View>
                    <Text>
                      Trạng thái:
                      <Text
                        style={{
                          color: getStatusRender(item.status).color
                        }}
                      >
                        {' '}
                        {getStatusRender(item.status).label}
                      </Text>
                    </Text>
                    {item.reason && <Text>Lý do: {item.reason}</Text>}
                    <Text>
                      Thời gian: {moment.unix(Number(item.time)).format('HH:mm DD/MM/YYYY')}
                    </Text>
                  </View>

                  {/* IconButton ở bên phải */}
                  {imageUri && (
                    <IconButton
                      icon='image' // Icon bạn muốn sử dụng
                      size={24}
                      onPress={() => {
                        setSelectedImageUri(imageUri);
                        setModalVisible(true);
                      }}
                      iconColor={theme.colors.primary}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
