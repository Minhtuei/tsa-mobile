import { useAppSelector } from '@hooks/redux';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetDeliveriesQuery } from '@services/delivery.service';
import { Delivery as DeliveryEntity } from '@slices/delivery.slice';
import { DeliveryStackParamList, MainTabParamList } from 'app/types/navigation';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import DeliveryListHeader from './components/DeliveryListHeader';
import DeliveryDetail from './DeliveryDetail';
import DeliveryList from './DeliveryList';
import StaffTrackOrder from './staff/StaffTrackOrder';
import { Header } from '@components/Header';

const Stack = createNativeStackNavigator<DeliveryStackParamList>();

export const Delivery = (props: NativeStackScreenProps<MainTabParamList, 'Delivery'>) => {
  const { data: deliveries, error, isLoading } = useGetDeliveriesQuery();
  const auth = useAppSelector((state) => state.auth);
  const filteredDeliveries = useMemo(() => {
    return deliveries?.filter((delivery) => delivery.staffId === auth?.userInfo?.id);
  }, [deliveries]);

  const handleSearch = (searchText: string) => {
    // Implement search functionality if needed
  };

  const handleFilter = (status: string | null, date: Date | null) => {
    // Implement filter functionality if needed
  };

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <Header {...props} />
      }}
      initialRouteName='DeliveryList'
    >
      <Stack.Screen
        name='DeliveryList'
        options={{
          title: 'Danh sách chuyến đi',
          header: ({ navigation }) => (
            <DeliveryListHeader
              onSearch={handleSearch}
              onFilter={handleFilter}
              title='DANH SÁCH CHUYẾN ĐI'
              showFilters={true}
              navigation={navigation as any}
            />
          )
        }}
      >
        {(props) => (
          <DeliveryList
            {...props}
            deliveries={filteredDeliveries as DeliveryEntity[]}
            loading={isLoading}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name='DeliveryDetail'
        component={DeliveryDetail}
        options={{
          title: 'Chi tiết chuyến đi',
          header: ({ navigation }) => (
            <DeliveryListHeader
              onSearch={handleSearch}
              onFilter={handleFilter}
              title='CHI TIẾT CHUYẾN ĐI'
              showFilters={false}
              navigation={navigation as any}
            />
          )
        }}
      />
      <Stack.Screen
        name='StaffTrackOrder'
        component={StaffTrackOrder}
        options={{
          title: 'Theo dõi đơn hàng'
        }}
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
