import { SCREEN } from '@constants/screen';
import { OrderStackParamList, DeliveryStackParamList } from 'app/types/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, IconButton, Portal, Text } from 'react-native-paper';
import { useAppDispatch } from '@hooks/redux';
import { setHideTabBar } from '@slices/app.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { StaffOrderMap } from './StaffOrderMap';
import moment from 'moment';
import { shortenUUID } from '@utils/order';
import { FontAwesome } from '@expo/vector-icons';
import { formatDistance } from '@utils/getDirection';
import { formatVNDcurrency } from '@utils/format';
import { SlideButton } from '@components/SlideButton';
import { ConfirmationDialog } from '@components/ConfirmDialog';
export const StaffTrackOrder = (
  props: NativeStackScreenProps<DeliveryStackParamList, 'StaffTrackOrder'>
) => {
  const order = props.route.params.order;
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const [isComplete, setIsComplete] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  const snapPoints = useMemo(() => ['50%'], []);
  const dispatch = useAppDispatch();
  const [distance, setDistance] = useState<string | null>(null);
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
          visible={isComplete || isCancel}
          setVisible={() => {
            if (isComplete) {
              setIsComplete(false);
            }
            if (isCancel) {
              setIsCancel(false);
            }
          }}
          onSubmit={() => {
            props.navigation.goBack();
          }}
          title='Thông báo'
          content={
            isComplete
              ? 'Bạn có chắc chắn muốn hoàn thành đơn hàng này?'
              : 'Bạn có chắc chắn muốn hủy đơn hàng này?'
          }
        />
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
              onPress={() => {
                setIsCancel(true);
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
