import DatePicker from '@components/order/DatePicker';
import { DropDownList } from '@components/order/DropDownList';
import { FilterBtnDropdown } from '@components/order/FilterBtnDropdown';
import { SearchInput } from '@components/order/SearchInput';
import { FILTER_DATA, STATUS_DATA, STATUS_DATA_TYPE } from '@constants/filter';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { useGetOrdersQuery } from '@services/order.service';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import { OrderItem } from './OrderItem';
import { SCREEN } from '@constants/screen';
import BackgroundIcon from '../../../assets/background-icon.svg';
import Toast from 'react-native-root-toast';
import { getErrorMessage } from '@utils/helper';
import {
  AuthStackParamList,
  OrderStackParamList,
  RootStackParamList,
} from 'app/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const OrderList = (
  props: NativeStackScreenProps<OrderStackParamList, 'OrderList'>
) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [data, setData] = useState<STATUS_DATA_TYPE[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePickerBtn, setShowDatePickerBtn] = useState(false);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
    isFetching,
    error,
  } = useGetOrdersQuery();
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  console.log('orders', orders);
  useEffect(() => {
    if (filterType !== 'TIME') {
      setShowDatePickerBtn(false);
    } else {
      setShowDatePickerBtn(true);
    }
  }, [status, filterType]);
  useEffect(() => {
    if (isError) {
      Toast.show(getErrorMessage(error), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.error,
      });
    }
  }, [isError, error]);
  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View
          style={{
            height: Platform.OS === 'android' ? 180 : 200,
            backgroundColor: theme.colors.primary,
            justifyContent: 'flex-end',
            paddingHorizontal: 16,
            paddingTop: Platform.OS === 'android' ? 0 : 16,
            paddingBottom: 16,
          }}
        >
          <Text
            style={[
              globalStyles.title,
              {
                color: theme.colors.onPrimary,
                fontSize: 24,
                textTransform: 'uppercase',
                marginBottom: 8,
              },
            ]}
          >
            Danh sách đơn hàng
          </Text>
          <SearchInput
            value={orderId ?? ''}
            onChange={setOrderId}
            placeholder="Tìm kiếm"
            pressable={false}
            left={
              <MaterialIcons
                name="search"
                size={24}
                color={theme.colors.onBackground}
              />
            }
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
            }}
          >
            <View style={{ width: '70%' }}>
              {showDatePickerBtn ? (
                <SearchInput
                  value={
                    startDate && endDate
                      ? `${moment(startDate).format('DD/MM/YYYY')} - ${moment(endDate).format('DD/MM/YYYY')}`
                      : 'Từ ngày - Đến ngày'
                  }
                  onChange={() => {}}
                  placeholder="Từ ngày"
                  pressable={true}
                  disabled={true}
                  onPress={() => setIsDatePicker(true)}
                  right={
                    <MaterialIcons
                      name="date-range"
                      size={24}
                      color={theme.colors.onBackground}
                    />
                  }
                />
              ) : (
                <DropDownList
                  data={STATUS_DATA}
                  value={status}
                  setValue={setStatus}
                  placeholder="Tất cả trạng thái"
                />
              )}
            </View>
            <FilterBtnDropdown
              data={FILTER_DATA}
              value={filterType}
              setValue={setFilterType}
            />
          </View>
          {isDatePicker && (
            <DatePicker
              shown={isDatePicker}
              setShown={setIsDatePicker}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDate={startDate}
              endDate={endDate}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
        contentContainerStyle={{
          height: '100%',
          padding: 24,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        data={orders}
        renderItem={({ item }) => (
          <OrderItem
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
              flex: 1,
            }}
          >
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>
              Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
            </Text>
            <BackgroundIcon
              width={SCREEN.width * 0.8}
              height={SCREEN.height * 0.3}
            />
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
          borderRadius: 50,
        }}
        icon="plus"
      />
    </View>
  );
};
