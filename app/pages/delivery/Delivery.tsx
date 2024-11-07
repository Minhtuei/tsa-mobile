import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Header } from '@components/Header';
import DeliveryListHeader from './components/DeliveryListHeader';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, MainTabParamList, DeliveryStackParamList } from 'app/types/navigation';
import DeliveryList from './DeliveryList';
import DeliveryDetail from './DeliveryDetail';
import { useGetDeliveriesQuery } from '@services/delivery.service';
import { Delivery as DeliveryEntity } from '@slices/delivery.slice';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export const Delivery = (props: NativeStackScreenProps<MainTabParamList, 'Delivery'>) => {
  const { data: deliveries, error, isLoading } = useGetDeliveriesQuery();

  const handleSearch = (searchText: string) => {
    // Implement search functionality if needed
  };

  const handleFilter = (status: string | null, date: Date | null) => {
    // Implement filter functionality if needed
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <DeliveryListHeader onSearch={handleSearch} onFilter={handleFilter} />
      }}
    >
      <Stack.Screen name='DeliveryList' options={{ title: 'Danh sách chuyến đi' }}>
        {(props) => (
          <DeliveryList
            {...props}
            deliveries={deliveries as DeliveryEntity[]}
            loading={isLoading}
          />
        )}
      </Stack.Screen>
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
