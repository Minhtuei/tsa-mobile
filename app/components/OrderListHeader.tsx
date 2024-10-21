import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import {
  Keyboard,
  Platform,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SearchInput } from './order/SearchInput';
import { DropDownList } from './order/DropDownList';
import { FilterBtnDropdown } from './order/FilterBtnDropdown';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import DatePicker from './order/DatePicker';
import { FILTER_DATA, STATUS_DATA, STATUS_DATA_TYPE } from '@constants/filter';
import moment from 'moment';

type OrderListHeaderProps = {
  orderId: string | null;
  setOrderId: (value: string | null) => void;
  status: string | null;
  setStatus: (value: string | null) => void;
  filterType: string | null;
  setFilterType: (value: string | null) => void;
  startDate: Date | null;
  setStartDate: (value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
};
export const OrderListHeader = ({
  orderId,
  setOrderId,
  status,
  setStatus,
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: OrderListHeaderProps) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = filterType === 'TIME';

  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (filterType === 'ALL') {
      setStartDate(null);
      setEndDate(null);
      setOrderId(null);
      setStatus(null);
    }
  }, [filterType]);
  return (
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
            {showDatePicker ? (
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
                onPress={() => setIsDatePickerVisible(true)}
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
        {isDatePickerVisible && (
          <DatePicker
            shown={isDatePickerVisible}
            setShown={setIsDatePickerVisible}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
