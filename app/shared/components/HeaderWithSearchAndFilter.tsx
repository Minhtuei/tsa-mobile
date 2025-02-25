import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';
import DatePicker from './order/DatePicker';
import { DropDownList } from './order/DropDownList';
import { FilterBtnDropdown } from './order/FilterBtnDropdown';
import { SearchInput } from './order/SearchInput';

type OrderListHeaderProps = {
  searchString: string | null;
  setSearchString: (value: string | null) => void;
  status: string | null;
  setStatus: (value: string | null) => void;
  filterType: string | null;
  setFilterType: (value: string | null) => void;
  startDate: Date | null;
  setStartDate: (value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
  title: string;
  filterList: { label: string; value: string }[];
  statusList: { label: string; value: string }[];
};
export const HeaderWithSearchAndFilter = ({
  searchString,
  setSearchString,
  status,
  setStatus,
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  title,
  filterList,
  statusList
}: OrderListHeaderProps) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = filterType === 'TIME';

  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (filterType === 'ALL') {
      setStartDate(null);
      setEndDate(null);
      setSearchString(null);
      setStatus(null);
    }
  }, [filterType]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View
        style={{
          height: Platform.OS === 'android' ? 180 : 200,
          backgroundColor: theme.colors.primary,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingBottom: 16
        }}
      >
        <Text
          style={[
            globalStyles.title,
            {
              color: theme.colors.onPrimary,
              fontSize: 24,
              textTransform: 'uppercase',
              marginBottom: 8
            }
          ]}
        >
          {title}
        </Text>
        <SearchInput
          value={searchString ?? ''}
          onChange={setSearchString}
          placeholder='Tìm kiếm'
          pressable={false}
          left={<MaterialIcons name='search' size={24} color={theme.colors.onBackground} />}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8
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
                placeholder='Từ ngày'
                pressable={true}
                disabled={true}
                onPress={() => setIsDatePickerVisible(true)}
                right={
                  <MaterialIcons name='date-range' size={24} color={theme.colors.onBackground} />
                }
              />
            ) : (
              <DropDownList
                data={statusList}
                value={status}
                setValue={setStatus}
                placeholder='Tất cả trạng thái'
              />
            )}
          </View>
          <FilterBtnDropdown data={filterList} value={filterType} setValue={setFilterType} />
        </View>
        {isDatePickerVisible && (
          <DatePicker
            shown={isDatePickerVisible}
            setShown={setIsDatePickerVisible}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDate={startDate}
            endDate={endDate}
            mode='range'
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
