import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Chip, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DeliveryStackParamList } from 'app/types/navigation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { formatVNDcurrency, formatUnixTimestamp, formatDate } from '@utils/format';
import { Delivery } from '@slices/delivery.slice';

type DeliveryListProps = NativeStackScreenProps<DeliveryStackParamList, 'DeliveryList'> & {
  deliveries: Delivery[];
  loading: boolean;
};

const DeliveryItem: React.FC<{ delivery: Delivery }> = ({ delivery }) => {
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

  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: '25%' }}>
          <View style={styles.square}>
            <MaterialCommunityIcons name='motorbike' size={32} color='green' />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 12, width: '75%' }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text
                style={{
                  color: 'green',
                  fontWeight: 'bold',
                  fontSize: 20
                }}
              >
                #{delivery.id}
              </Text>
              <Text style={{ opacity: 0.4 }}>
                {formatDate(formatUnixTimestamp(delivery.createdAt))}
              </Text>
            </View>
            <Chip
              style={{
                backgroundColor: getStatusColor(delivery.status)
              }}
              textStyle={{
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              {getStatusLabel(delivery.status)}
            </Chip>
          </View>
          <Divider />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text style={{ fontWeight: 'bold' }}>{delivery.orders.length} đơn hàng</Text>
            </View>
            <EvilIcons name='pencil' size={32} color='blue' />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const DeliveryList: React.FC<DeliveryListProps> = ({ deliveries, loading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{deliveries.length} chuyến đi</Text>
      {loading ? (
        <ActivityIndicator size='large' color='#34A853' />
      ) : (
        <ScrollView>
          {deliveries.map((delivery) => (
            <DeliveryItem key={delivery.id} delivery={delivery} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    alignSelf: 'center'
  }
});

export default DeliveryList;
