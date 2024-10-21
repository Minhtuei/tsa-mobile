import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Header } from '@components/Header';
import DeliveryListHeader from './components/DeliveryListHeader';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList, DeliveryStackParamList } from 'app/types/navigation';
import DeliveryList from './DeliveryList';
import { initialDeliveryList } from '@utils/mockData';
import DeliveryDetail from './DeliveryDetail';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export const Delivery = (props: NativeStackScreenProps<MainTabParamList, 'Delivery'>) => {
  const [filteredDeliveries, setFilteredDeliveries] = useState(initialDeliveryList.slice(0, 16));
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchText: string) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = initialDeliveryList.filter((delivery) =>
        delivery.id.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDeliveries(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  const handleFilter = (status: string | null, date: Date | null) => {
    setLoading(true);
    setTimeout(() => {
      let filtered = initialDeliveryList;

      if (status !== null) {
        filtered = filtered.filter((delivery) => delivery.status === status);
      }

      if (date) {
        filtered = filtered.filter(
          (delivery) => new Date(delivery.createdAt).toDateString() === date.toDateString()
        );
      }

      setFilteredDeliveries(filtered);
      setLoading(false);
    }, 500); // Simulate a delay for loading
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <DeliveryListHeader onSearch={handleSearch} onFilter={handleFilter} />
      }}
    >
      <Stack.Screen
        name='DeliveryList'
        component={(props: any) => (
          <DeliveryList {...props} deliveries={filteredDeliveries} loading={loading} />
        )}
        options={{ title: 'Danh sách chuyến đi' }}
      />
      <Stack.Screen
        name='DeliveryDetail'
        component={DeliveryDetail}
        options={{ title: 'Chi tiết chuyến đi' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    marginTop: 20
  }
});

export default Delivery;
