import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetDeliveriesQuery } from '@services/delivery.service';
import { Delivery as DeliveryEntity } from '@slices/delivery.slice';
import { formatDate, formatUnixTimestamp } from '@utils/format';
import { DeliveryStackParamList } from 'app/types/navigation';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Divider, Text } from 'react-native-paper';
import DeliveryListHeader from './components/DeliveryListHeader';

const DeliveryItem: React.FC<{ delivery: DeliveryEntity; onPress: () => void }> = ({
  delivery,
  onPress
}) => {
  const theme = useAppTheme();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'ACCEPTED':
        return 'blue';
      case 'FINISHED':
        return 'green';
      case 'CANCELED':
        return 'red';
      default:
        return 'red';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xử lý';
      case 'ACCEPTED':
        return 'Chấp nhận';
      case 'FINISHED':
        return 'Hoàn thành';
      case 'CANCELED':
        return 'Đã hủy';
      default:
        return 'Chờ xử lý';
    }
  };
  const latestStatus = delivery.DeliveryStatusHistory[0].status;
  return (
    <Card style={{ marginBottom: 12, backgroundColor: theme.colors.surface }} onPress={onPress}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={styles.square}>
          <MaterialCommunityIcons name='motorbike' size={32} color='green' />
        </View>
        <View style={{ flexDirection: 'column', gap: 12, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: 'green',
                  fontWeight: 'bold',
                  fontSize: 20
                }}
                numberOfLines={1}
              >
                #{delivery.id.slice(0, 5)}saddddddddddddddd
              </Text>
              <Text style={{ opacity: 0.4 }}>
                {formatDate(formatUnixTimestamp(delivery.createdAt))}
              </Text>
            </View>
            <Chip
              style={{
                backgroundColor: getStatusColor(latestStatus)
              }}
              textStyle={{
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {getStatusLabel(latestStatus)}
            </Chip>
          </View>
          <Divider />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Text style={{ fontWeight: 'bold', flex: 1 }}>
              {delivery?.orders?.length || 0} đơn hàng
            </Text>
            <EvilIcons name='pencil' size={32} color='blue' />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const DeliveryList = (
  props: NativeStackScreenProps<DeliveryStackParamList, 'DeliveryList'>
) => {
  const { data: deliveries, isFetching, refetch } = useGetDeliveriesQuery();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleFilter = (status: string | null, date: Date | null) => {
    setFilterStatus(status);
    setFilterDate(date);
  };

  const filteredDeliveries = useMemo(() => {
    return deliveries?.filter((delivery) => {
      const matchesSearchText = delivery.id.includes(searchText);
      const matchesStatus = filterStatus
        ? delivery.DeliveryStatusHistory[0].status === filterStatus
        : true;
      const matchesDate = filterDate
        ? new Date(Number(delivery.createdAt) * 1000).toDateString() === filterDate.toDateString()
        : true;
      return matchesSearchText && matchesStatus && matchesDate;
    });
  }, [deliveries, searchText, filterStatus, filterDate]);

  return (
    <View style={styles.container}>
      <DeliveryListHeader
        onSearch={handleSearch}
        onFilter={handleFilter}
        title='DANH SÁCH CHUYẾN ĐI'
        showFilters={true}
        navigation={props.navigation}
      />
      <Text style={styles.header}>{filteredDeliveries?.length} chuyến đi</Text>

      <ScrollView
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{ padding: 16 }}
      >
        {filteredDeliveries?.map((delivery) => (
          <DeliveryItem
            key={delivery.id}
            delivery={delivery}
            onPress={() => props.navigation.navigate('DeliveryDetail', { deliveryId: delivery.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16
  },

  square: {
    width: 80,
    height: 80,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12
  }
});

export default DeliveryList;
