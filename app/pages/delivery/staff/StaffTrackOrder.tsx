import { SCREEN } from '@constants/screen';
import { OrderStackParamList, DeliveryStackParamList } from 'app/types/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useAppDispatch } from '@hooks/redux';
import { setHideTabBar } from '@slices/app.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import StaffOrderMap from './StaffOrderMap';
import moment from 'moment';
import { shortenUUID } from '@utils/order';
import { FontAwesome } from '@expo/vector-icons';
export const StaffTrackOrder = (
  props: NativeStackScreenProps<DeliveryStackParamList, 'StaffTrackOrder'>
) => {
  const order = props.route.params.order;
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const snapPoints = useMemo(() => ['50%'], []);
  const dispatch = useAppDispatch();
  const [distance, setDistance] = useState<string | null>(null);
  useEffect(() => {
    dispatch(setHideTabBar(true));
    return () => {
      dispatch(setHideTabBar(false));
    };
  }, [dispatch]);
  const shippingFee = order.paymentMethod === 'CASH' ? (order.shippingFee ?? '5000 VNĐ') : '0 VNĐ';
  return (
    <View style={styles.page}>
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
                {/* {auth.userInfo?.photoUrl ? (
                  <Image
                    source={{ uri: auth.userInfo?.photoUrl }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : ( */}
                <FontAwesome name='user' size={24} color='white' />
                {/* )} */}
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
                Trần Văn Cường
              </Text>
              <IconButton
                icon={'phone'}
                size={24}
                onPress={() => {
                  Linking.openURL(`tel:${order.staffInfo?.phoneNumber}`);
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
              <Text style={[globalStyles.title, { fontSize: 20 }]}> {shortenUUID(order.id)}</Text>
              <Text
                style={[
                  globalStyles.text,
                  {
                    color: theme.colors.outlineVariant,
                    marginLeft: 'auto'
                  }
                ]}
              >
                {distance ?? '0'}m
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Sản phẩm</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {order.product}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Cân nặng</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {order.weight} kg
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Địa chỉ</Text>
              <Text
                style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}
              >{`${order.building} - ${order.room}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Thời gian:</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {moment.unix(Number(order.deliveryDate)).format('DD/MM/YYYY HH:mm') ?? 'N/A'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={[globalStyles.title, { width: '40%' }]}>Giá tiền:</Text>
              <Text style={[globalStyles.text, { width: '60%', textAlign: 'right' }]}>
                {shippingFee}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                mode='contained'
                style={{ flex: 1 }}
                onPress={() => {
                  // props.navigation.navigate('Chat', { user: shipper });
                }}
              >
                Hoàn thành đơn hàng
              </Button>
            </View>
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
