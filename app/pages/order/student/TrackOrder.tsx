import { SCREEN } from '@constants/screen';
import { OrderStackParamList } from 'app/types/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, IconButton, Text } from 'react-native-paper';
import { useAppDispatch } from '@hooks/redux';
import { setHideTabBar } from '@slices/app.slice';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import OrderStatusStepIndicator from '../components/OrderStatusStepIndicator';
import LottieView from 'lottie-react-native';
import OrderMap from '../components/OrderMap'; // Import the new component

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
                {order.staffInfo?.photoUrl ? (
                  <Avatar.Image size={48} source={{ uri: order.staffInfo?.photoUrl }} />
                ) : (
                  <Avatar.Text size={48} label={order.staffInfo?.lastName ?? 'NV'} />
                )}

                <Text
                  style={[
                    globalStyles.text,
                    {
                      fontWeight: 'semibold'
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
          <OrderStatusStepIndicator historyTime={order.historyTime} />
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
