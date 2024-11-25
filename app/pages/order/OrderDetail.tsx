import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, OrderStackParamList, ReportStackParamList } from 'app/types/navigation';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { getStatusRender, shortenUUID } from '@utils/order';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native';
import { SCREEN } from '@constants/screen';
import { CompositeScreenProps } from '@react-navigation/native';

export const OrderDetail = (
  props: CompositeScreenProps<
    NativeStackScreenProps<OrderStackParamList, 'OrderDetail'>,
    NativeStackScreenProps<MainTabParamList, 'Report'>
  >
) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const order = props.route.params.order;
  const statusRender = getStatusRender(order.latestStatus);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        position: 'relative',
        height: '100%'
      }}
    >
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
            <Text style={[globalStyles.title, { fontSize: 24 }]}> {shortenUUID(order.id)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Checkcode:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.checkCode}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Sản phẩm</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.product}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Địa chỉ</Text>
            <Text
              style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}
            >{`${order.building} - ${order.room}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Trạng thái:</Text>
            <Text
              style={[
                globalStyles.text,
                { width: '60%', color: statusRender.color, textAlign: 'right' }
              ]}
            >
              {statusRender.label}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Thời gian:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {moment.unix(Number(order.historyTime[0].time)).format('DD/MM/YYYY') ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Giá tiền:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.shippingFee ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%' }]}>Phương thức thanh toán:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.paymentMethod === 'CASH'
                ? 'Tiền mặt'
                : order.paymentMethod === 'MOMO'
                  ? 'Momo'
                  : 'Qua ngân hàng'}
            </Text>
          </View>
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
              justifyContent: 'space-between'
            }}
          >
            <Button
              mode='contained'
              style={[{ backgroundColor: theme.colors.error, minWidth: 60 }]}
              onPress={() => {
                props.navigation.navigate('Report', {
                  screen: 'CreateReport',
                  params: { orderId: order.id }
                });
              }}
              icon={'alert-circle'}
            >
              Khiếu nại
            </Button>
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
      </View>
    </ScrollView>
  );
};
