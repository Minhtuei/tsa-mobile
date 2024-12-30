import { DashboardHeader } from '@components/DashboardHeader';
import { Feather } from '@expo/vector-icons';
import { useGetStatisticsQuery } from '@services/order.service';
import { memo, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { StaffOrderCard } from './staff/StaffOrderCard';
import { Piechart } from './components/Piechart';
import { LoadingScreen } from '@components/LoadingScreen';
export const StudentDashBoard = () => {
  const {
    data: orderStatistic,
    isFetching: isGetOrderStatisticFetching,
    refetch: refetchOrderStatistic,
    isLoading: isOrderStatisticLoading
  } = useGetStatisticsQuery({ type: 'week' });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isGetOrderStatisticFetching}
          onRefresh={() => {
            refetchOrderStatistic();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
      stickyHeaderIndices={[0]}
    >
      <Portal>{isOrderStatisticLoading && <LoadingScreen />}</Portal>
      <DashboardHeader />
      <View style={{ padding: 16 }}>
        <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
          <Feather name='box' size={24} color='black' />
          <Text style={styles.sectionHeader}>Thống kê đơn hàng</Text>
        </View>
        <View style={styles.rowWithGapLarge}>
          <StaffOrderCard
            numberOfOrders={orderStatistic?.totalOrdersLastMonth}
            color='#1ED7AA'
            title='Tháng này'
          />
          <StaffOrderCard
            numberOfOrders={orderStatistic?.totalOrdersLastWeek}
            color='#00BBD4'
            title='Tuần này'
          />
        </View>
        <Piechart data={orderStatistic?.brandPercentages} />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  rowWithGap: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center'
  },
  rowWithGapSmall: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center'
  },
  rowButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%'
  },
  rowWithGapGreen: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    color: 'green'
  },
  rowWithGapLarge: {
    flexDirection: 'row',
    width: '100%',
    gap: 16
  },
  columnWithGap: {
    flexDirection: 'column',
    gap: 16
  },
  boldText: {
    fontWeight: 'bold'
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'orange'
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
