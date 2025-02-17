import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useAppDispatch } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { setHideTabBar } from 'app/shared/state/app.slice';
import { OrderStackParamList } from 'app/shared/types/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import OrderMap from '../components/OrderMap'; // Import the new component
import OrderStatusStepIndicator from '../components/OrderStatusStepIndicator';
import { FontAwesome } from '@expo/vector-icons';
import { apiService } from '@services/api.service';
export const TrackOrder = (props: NativeStackScreenProps<OrderStackParamList, 'TrackOrder'>) => {
  const order = props.route.params.order;
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const snapPoints = useMemo(() => ['5%', '40%', '90%'], []);
  const dispatch = useAppDispatch();
  const [distance, setDistance] = useState<string | null>(null);
  useEffect(() => {
    dispatch(setHideTabBar(true));
    return () => {
      dispatch(setHideTabBar(false));
    };
  }, [dispatch]);
  // useEffect(() => {
  //   if (isFinished) {
  //     dispatch(apiService.util.invalidateTags(['Orders']));
  //     props.navigation.navigate('OrderList');
  //   }
  // }, [isFinished, props.navigation, order, dispatch]);
  return (
    <View style={styles.page}>
      <OrderMap order={order} setDistance={setDistance} />
      <BottomSheet index={1} snapPoints={snapPoints}>
        <BottomSheetView style={{ padding: 12, gap: 8 }}>
          {order.latestStatus === 'IN_TRANSPORT' && (
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
                  {order.staffInfo?.photoUrl ? (
                    <Image
                      source={{ uri: order.staffInfo?.photoUrl }}
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
                  {order.staffInfo?.lastName} {order.staffInfo?.firstName}
                </Text>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  icon={'chat'}
                  mode='contained'
                  disabled
                  style={{ flex: 0.95 }}
                  onPress={() => {
                    // props.navigation.navigate('Chat', { user: shipper });
                  }}
                >
                  Chat với nhân viên
                </Button>
                <IconButton
                  icon={'phone'}
                  size={24}
                  onPress={() => {
                    Linking.openURL(`tel:${order.staffInfo?.phoneNumber}`);
                  }}
                  mode='outlined'
                />
              </View>
            </View>
          )}
          <OrderStatusStepIndicator
            currentStatus={order.latestStatus}
            historyTime={order.historyTime}
          />
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

export default TrackOrder;
