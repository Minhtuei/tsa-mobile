import { OrderListHeader } from '@components/OrderListHeader';
import { STATUS_DATA_TYPE } from '@constants/filter';
import { SCREEN } from '@constants/screen';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetOrdersQuery } from '@services/order.service';
import { getErrorMessage } from '@utils/helper';
import { shortenUUID } from '@utils/order';
import { OrderStackParamList } from 'app/types/navigation';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import BackgroundIcon from '../../../../assets/background-icon.svg';
import { StudentOrderItem } from './StudentOrderItem';

export const StudentOrderList = (
  props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>
) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [data, setData] = useState<STATUS_DATA_TYPE[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: orders, isLoading, isError, refetch, isFetching, error } = useGetOrdersQuery();
  console.log('orders', orders);
  useEffect(() => {
    if (isError) {
      Toast.show(getErrorMessage(error), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.error
      });
    }
  }, [isError, error]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    let result = orders;
    // Filter by orderId
    if (orderId) {
      result = result.filter((order) => shortenUUID(order.id).includes(orderId));
    }
    // Filter by status
    if (status) {
      result = result.filter((order) => order.latestStatus === status);
    }
    // Filter by time range if filterType is 'TIME'
    if (filterType === 'TIME' && startDate && endDate) {
      result = result.filter((order) => {
        return (
          moment(startDate).isSameOrBefore(moment.unix(Number(order.historyTime[0].time)), 'day') &&
          moment(endDate).isSameOrAfter(moment.unix(Number(order.historyTime[0].time)), 'day')
        );
      });
    }

    return result;
  }, [orders, orderId, status, filterType, startDate, endDate]);

  return (
    <View style={{ flex: 1 }}>
      <OrderListHeader
        {...{
          orderId,
          setOrderId,
          status,
          setStatus,
          filterType,
          setFilterType,
          startDate,
          setStartDate,
          endDate,
          setEndDate
        }}
      />
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{
          height: '100%',
          padding: 24,
          gap: 16
        }}
        showsVerticalScrollIndicator={false}
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={globalStyles.title}>Danh sách đơn hàng</Text>
            <Text style={globalStyles.text}>{`${filteredOrders?.length ?? 0} đơn hàng`}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <StudentOrderItem
            order={item}
            onPress={() => {
              props.navigation.navigate('OrderDetail', { order: item });
            }}
          />
        )}
        ListEmptyComponent={
          <View
            style={{
              zIndex: -1,
              opacity: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>
              Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
            </Text>
            <BackgroundIcon width={SCREEN.width * 0.8} height={SCREEN.height * 0.3} />
          </View>
        }
      />
      <FAB
        onPress={() => {
          console.log('FAB');
        }}
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 50
        }}
        icon='plus'
      />
    </View>
  );
};
