import { HeaderWithSearchAndFilter } from 'app/shared/components/HeaderWithSearchAndFilter';
import { SCREEN } from 'app/shared/constants/screen';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetOrdersQuery } from 'app/features/order/api/order.api';
import { getErrorMessage } from 'app/shared/utils/helper';
import { OrderStackParamList } from 'app/shared/types/navigation';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import BackgroundIcon from '../../../../assets/background-icon.svg';
import { StudentOrderItem } from '../components/StudentOrderItem';
import { FILTER_DATA, ORDER_STATUS_DATA } from 'app/shared/constants/filter';

export const OrderList = (props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: orders, isError, refetch, isFetching, error } = useGetOrdersQuery();
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
      result = result.filter((order) => order.checkCode.includes(orderId));
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
      <HeaderWithSearchAndFilter
        title='Danh sách đơn hàng'
        searchString={orderId}
        setSearchString={setOrderId}
        filterList={FILTER_DATA}
        statusList={ORDER_STATUS_DATA}
        {...{
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
          padding: 24,
          gap: 16,
          paddingBottom: 120
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
          props.navigation.navigate('CreateOrder', { order: undefined });
        }}
        style={{
          position: 'absolute',
          bottom: 120,
          right: 16,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 50
        }}
        icon='plus'
      />
    </View>
  );
};
