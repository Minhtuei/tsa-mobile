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
  Keyboard,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';

export const OrderList = () => {
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
    error,
  } = useGetOrdersQuery();
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (filterType !== 'TIME') {
      setShowDatePickerBtn(false);
    } else {
      setShowDatePickerBtn(true);
    }
  }, [status, filterType]);

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      ></ScrollView>
    </View>
  );
};
