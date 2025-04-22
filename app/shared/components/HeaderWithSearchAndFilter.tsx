import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
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
  isPaid: string | null;
  setIsPaid: (value: string | null) => void;
  filterType: string | null;
  setFilterType: (value: string | null) => void;
  startDate: Date | null;
  setStartDate: (value: Date | null) => void;
  endDate: Date | null;
  setEndDate: (value: Date | null) => void;
  title: string;
  filterList: { label: string; value: string }[];
  statusList: { label: string; value: string }[];
  paymentList: { label: string; value: string }[];
  canSearch: boolean;
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
  statusList,
  paymentList,
  isPaid,
  setIsPaid,
  canSearch
}: OrderListHeaderProps) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const showDatePicker = filterType === 'TIME';
  const [isShowDropDown, setIsShowDropDown] = useState(true);
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    if (filterType === 'ALL') {
      setStartDate(null);
      setEndDate(null);
      setSearchString(null);
      setStatus(null);
      setIsShowDropDown(false);
    } else {
      setIsShowDropDown(true);
    }
  }, [filterType]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: 16,
          minHeight: 100,
          gap: 4
        }}
      >
        <View
          style={{
            // height: Platform.OS === 'android' ? 180 : 200,
            justifyContent: isShowDropDown ? 'flex-end' : 'space-between',
            flexDirection: isShowDropDown ? 'column' : 'row',
            alignItems: isShowDropDown ? 'stretch' : 'center'
          }}
        >
          <Text
            style={[
              globalStyles.title,
              {
                color: theme.colors.onPrimary,
                fontSize: 24,
                textTransform: 'uppercase'
              }
            ]}
          >
            {title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {isShowDropDown && (
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
                      <MaterialIcons
                        name='date-range'
                        size={24}
                        color={theme.colors.onBackground}
                      />
                    }
                  />
                ) : (
                  <DropDownList
                    data={filterType === 'STATUS' ? statusList : paymentList}
                    value={filterType === 'STATUS' ? status : isPaid}
                    setValue={filterType === 'STATUS' ? setStatus : setIsPaid}
                    placeholder={filterType === 'STATUS' ? 'Tất cả trạng thái' : 'Tất cả'}
                  />
                )}
              </View>
            )}
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
        {canSearch && (
          <SearchInput
            value={searchString ?? ''}
            onChange={setSearchString}
            placeholder='Tìm kiếm'
            pressable={false}
            left={<MaterialIcons name='search' size={24} color={theme.colors.onBackground} />}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
