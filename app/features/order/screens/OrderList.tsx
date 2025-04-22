import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetOrdersQuery } from 'app/features/order/api/order.api';
import { HeaderWithSearchAndFilter } from 'app/shared/components/HeaderWithSearchAndFilter';
import {
  FILTER_ORDER_DATA,
  ORDER_STATUS_DATA,
  PAYMENT_STATUS_DATA
} from 'app/shared/constants/filter';
import { SCREEN } from 'app/shared/constants/screen';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { OrderStackParamList } from 'app/shared/types/navigation';
import { Order } from 'app/shared/types/order';
import { getErrorMessage, parseBoolean } from 'app/shared/utils/helper';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import BackgroundIcon from '../../../../assets/background-icon.svg';
import { StudentOrderItem } from '../components/StudentOrderItem';

export const OrderList = (props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isPaid, setIsPaid] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isLoadMore, setIsLoadMore] = useState(false);
  const { data, isError, refetch, isFetching, error } = useGetOrdersQuery({
    startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
    endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
    status: status ?? undefined,
    search: orderId ?? undefined,
    isPaid: parseBoolean(isPaid),
    sortBy: 'deliveryDate',
    sortOrder: 'desc',
    page: page
  });

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

  useEffect(() => {
    if (startDate || endDate || status || orderId) {
      setOrders([]);
      setPage(1);
      setIsLoadMore(false);
    }
  }, [startDate, endDate, status, orderId]);
  useEffect(() => {
    if (data && data.results.length > 0) {
      if (isLoadMore) {
        setOrders((prev) => {
          const existingIds = new Set(prev.map((o) => o.id));
          const newOrders = data.results.filter((o) => !existingIds.has(o.id));
          return [...prev, ...newOrders];
        });
      } else {
        setOrders(data.results);
        setPage(1);
      }
    } else {
      setOrders([]);
      setPage(1);
    }
  }, [data, isLoadMore]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderWithSearchAndFilter
        title='Danh sách đơn hàng'
        searchString={orderId}
        setSearchString={setOrderId}
        filterList={FILTER_ORDER_DATA}
        statusList={ORDER_STATUS_DATA}
        paymentList={PAYMENT_STATUS_DATA}
        {...{
          status,
          setStatus,
          filterType,
          setFilterType,
          startDate,
          setStartDate,
          endDate,
          setEndDate,
          setIsPaid,
          isPaid,
          canSearch: true
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
        data={orders}
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
            <Text style={globalStyles.text}>{`${data?.totalElements ?? 0} đơn hàng`}</Text>
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
        onEndReached={() => {
          // Đảm bảo là đang không load data và còn trang tiếp theo
          if (data?.totalPages && page >= data.totalPages) return; // tránh load thêm khi đã hết trang

          setIsLoadMore(true); // Bắt đầu loading
          setPage((prev) => prev + 1); // Tiến đến trang tiếp theo
        }}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          !isFetching && page === data?.totalPages ? (
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>Đã hết đơn hàng</Text>
          ) : null
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
