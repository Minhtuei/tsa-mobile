import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Divider, Text, TextInput, Button } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

const orderStatusMap = {
  'Đã giao': 'DELIVERED',
  'Đang giao': 'IN_TRANSPORT',
  'Đang chờ xử lý': 'PENDING',
  'Đã hủy': 'CANCELLED',
  'Đã từ chối': 'REJECTED',
  'Đã xác nhận': 'ACCEPTED'
};

const orderPaidMap = {
  'Đã thanh toán': true,
  'Chưa thanh toán': false
};

const orderStatusList = Object.entries(orderStatusMap).map(([label, value]) => ({ label, value }));
const orderPaidList = Object.entries(orderPaidMap).map(([label, value]) => ({ label, value }));

interface OrderListHeaderProps {
  onSearch: (searchText: string) => void;
  onFilter: (status: boolean | null, date: Date | null, orderStatus: string | null) => void;
}

export const OrderListHeader: React.FC<OrderListHeaderProps> = ({ onSearch, onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterDialogVisible, setFilterDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleFilterDialog = () => {
    setFilterDialogVisible(!isFilterDialogVisible);
  };

  const handleSelectStatus = (value: boolean | null) => {
    setSelectedStatus(value);
    toggleModal();
    onFilter(value, selectedDate, selectedOrderStatus);
  };

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setDatePickerVisible(false);
    if (event.type === 'set') {
      setSelectedDate(date || null);
    }
  };

  const handleOrderStatusChange = (status: string | null) => {
    setSelectedOrderStatus(status);
  };

  const handleConfirmFilter = () => {
    onFilter(selectedStatus, selectedDate, selectedOrderStatus);
    toggleFilterDialog();
    setFilterDialogVisible(false);
  };

  const handleResetFilter = () => {
    setSelectedStatus(null);
    setSelectedDate(null);
    setSelectedOrderStatus(null);
    onFilter(null, null, null);
    setFilterDialogVisible(false);
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>DANH SÁCH ĐƠN HÀNG</Text>
      <View style={{ flexDirection: 'column', gap: 4 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder='Tìm kiếm theo mã đơn hàng...'
            placeholderTextColor='rgba(0, 0, 0, 0.6)' // Set placeholder text color with opacity
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <AntDesign name='search1' size={24} color='blue' />
          </TouchableOpacity>
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.pickerButton} onPress={toggleModal}>
            <Text style={styles.pickerButtonText}>
              {selectedStatus === null
                ? 'Tất cả'
                : selectedStatus
                  ? 'Đã thanh toán'
                  : 'Chưa thanh toán'}
            </Text>
            <MaterialIcons name='arrow-drop-down' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilterDialog}>
            <Feather name='align-center' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={isModalVisible} transparent={true} animationType='slide'>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Thanh toán</Text>
          <FlatList
            data={[{ label: 'Tất cả', value: null }, ...orderPaidList]}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleSelectStatus(item.value)}
              >
                <Text style={styles.modalItemText}>{item.label}</Text>
                {selectedStatus === item.value && (
                  <AntDesign name='check' size={24} color='green' />
                )}
              </TouchableOpacity>
            )}
            style={styles.flatList}
          />
        </View>
      </Modal>
      <Modal visible={isFilterDialogVisible} transparent={true} animationType='slide'>
        <TouchableWithoutFeedback onPress={toggleFilterDialog}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.filterDialogContainer}>
          <View style={styles.filterDialogHeader}>
            <Text style={styles.filterDialogTitle}>Bộ lọc</Text>
            <TouchableOpacity onPress={toggleFilterDialog}>
              <AntDesign name='close' size={24} color='black' />
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.filterButtonsContainer}>
            <Button mode='contained' onPress={handleConfirmFilter} labelStyle={styles.buttonLabel}>
              Xác nhận
            </Button>
            <Button
              mode='outlined'
              onPress={handleResetFilter}
              labelStyle={{ ...styles.buttonLabel, color: 'green', borderColor: 'transparent' }}
            >
              Đặt lại
            </Button>
          </View>
          <ScrollView style={styles.filterDialogContent}>
            <Text style={styles.filterLabel}>Ngày giao hàng</Text>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.dateRangeText}>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode='date'
                display='default'
                onChange={handleDateChange}
              />
            )}
            <Text style={styles.filterLabel}>Trạng thái đơn hàng</Text>
            <FlatList
              data={Object.keys(orderStatusMap) as Array<keyof typeof orderStatusMap>}
              keyExtractor={(item) => item}
              renderItem={({ item }: { item: keyof typeof orderStatusMap }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleOrderStatusChange(orderStatusMap[item])}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {selectedOrderStatus === orderStatusMap[item] && (
                    <AntDesign name='check' size={24} color='green' />
                  )}
                </TouchableOpacity>
              )}
              style={styles.flatList}
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#34A853',
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexDirection: 'column',
    gap: 16
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  searchInput: {
    backgroundColor: 'white',
    height: 40,
    paddingHorizontal: 16,
    width: '80%',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  searchButton: {
    width: '20%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pickerButton: {
    width: '80%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16
  },
  pickerButtonText: {
    color: 'black'
  },
  filterButton: {
    width: '20%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%'
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'green'
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  modalItemText: {
    fontSize: 16
  },
  filterDialogContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '50%'
  },
  filterDialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  filterDialogTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    flex: 1
  },
  filterDialogContent: {
    flexDirection: 'column',
    gap: 16
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  dateRangeText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  buttonLabel: {
    color: 'white'
  },
  flatList: {
    maxHeight: 200
  }
});

export default OrderListHeader;
