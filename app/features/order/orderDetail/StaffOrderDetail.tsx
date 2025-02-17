import { Avatar, Button, Divider, Text } from 'react-native-paper';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { OrderStackParamList } from 'app/shared/types/navigation';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { getStatusRender, shortenUUID } from 'app/shared/utils/order';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import { SCREEN } from 'app/shared/constants/screen';
import { FontAwesome5 } from '@expo/vector-icons';

export const StaffOrderDetail = (
  prop: NativeStackScreenProps<OrderStackParamList, 'OrderDetail'>
) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const order = prop.route.params.order;
  const statusRender = getStatusRender(order.latestStatus);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
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
          height: SCREEN.height
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'transparent',
          paddingHorizontal: 8,
          paddingVertical: 16,
          gap: 32
        }}
      >
        <View
          style={[
            {
              width: '95%',
              padding: 16,
              backgroundColor: theme.colors.surface,
              borderRadius: 8,
              gap: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            },
            globalStyles.SurfaceContainer
          ]}
        >
          <Avatar.Image
            size={64}
            source={{ uri: 'https://i.pravatar.cc/300' }}
            style={{ marginRight: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.title}>Nguyễn Hoàng Duy Tân</Text>
            <Text style={[globalStyles.text, { color: theme.colors.outline, fontStyle: 'italic' }]}>
              Sinh viên
            </Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Avatar.Icon size={48} icon='chat' style={{ backgroundColor: theme.colors.primary }} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 24,
            borderWidth: 3,
            borderRadius: 8,
            width: '95%',
            gap: 8,
            position: 'relative'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Mã Đơn hàng:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {shortenUUID(order.id, 'ORDER')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Sản phẩm</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.product}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Địa chỉ</Text>
            <Text
              style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}
            >{`${order.building} - ${order.room}`}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Trạng thái:</Text>
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
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Thời gian:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {moment.unix(Number(order.historyTime[0].time)).format('DD/MM/YYYY') ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>Giá tiền:</Text>
            <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
              {order.shippingFee ?? 'N/A'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={[globalStyles.title, { width: '40%', fontSize: 16 }]}>
              Phương thức thanh toán:
            </Text>
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
          <View style={{ gap: 8 }}>
            <Button
              mode='contained'
              style={[{ backgroundColor: theme.colors.success, borderRadius: 16 }]}
              onPress={() => {
                // prop.navigation.navigate('OrderHistory', { order: order });
              }}
            >
              Cập nhật trạng thái
            </Button>
            <Button
              mode='outlined'
              style={{ borderRadius: 16, backgroundColor: 'white' }}
              icon='directions'
            >
              Đường đi
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
};
