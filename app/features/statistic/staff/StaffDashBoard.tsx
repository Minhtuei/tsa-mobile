import QueryTypeBtnTab from 'app/shared/components/QueryTypeBtnTab';
import { DASHBOARD_HEADER_HEIGHT, SCREEN } from 'app/shared/constants/screen';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from 'app/shared/hooks/redux';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { formatVNDcurrency } from 'app/shared/utils/format';
import { OrderDetail } from 'app/shared/state/order.slice';
import Constants from 'expo-constants';
import React, { memo, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import HeaderLogo from '../../../../assets/tsa-header.svg';
import { useGetStatisticsQuery } from '../api/statistic.api';
import { Barchart } from '../components/Barchart';
import { StaffInfoCard } from './StaffInfoCard';

const BackgroundImg = require('../../../../assets/header-background.png');
const StaffCurrentOrder = memo(function StaffCurrentOrder({ order }: { order: OrderDetail }) {
  return (
    <View>
      <Text style={styles.header}>Đơn hàng hiện tại</Text>
      <Card>
        <Card.Content style={styles.cardContent}>
          <View style={styles.rowBetween}>
            <View style={styles.rowWithGap}>
              <Text>Mã ĐH:</Text>
              <Text style={styles.boldText}>#{order.checkCode}</Text>
            </View>
            <View style={styles.rowWithGapSmall}>
              <View style={styles.circle}></View>
              <Text>Đang vận chuyển</Text>
            </View>
          </View>
          <View style={styles.rowWithGap}>
            <Ionicons name='location-sharp' size={24} color='black' />
            <Text>
              Phòng {order.room}, Tòa {order.building}, KTX Khu {order.dormitory}
            </Text>
          </View>
          <View style={styles.rowButtonGroup}>
            <Button mode='outlined' style={{ backgroundColor: 'white' }}>
              Chi tiết
            </Button>
            <Button
              icon={() => <MaterialCommunityIcons name='directions' size={24} color='white' />}
              mode='contained'
            >
              Đường đi
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
});

export const StaffDashBoard = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<'week' | 'month' | 'year'>('week');
  const auth = useAppSelector((state) => state.auth);
  const {
    data: orderStatistic,
    isFetching: isGetOrderStatisticFetching,
    refetch: refetchOrderStatistic,
    isLoading: isOrderStatisticLoading
  } = useGetStatisticsQuery({ type: selectedType });
  useEffect(() => {
    refetchOrderStatistic();
  }, [selectedType]);
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
      <View style={{ height: SCREEN.height / 2.5 }}>
        <ImageBackground
          source={BackgroundImg}
          style={[
            {
              width: SCREEN.width,
              height: DASHBOARD_HEADER_HEIGHT
            }
          ]}
        >
          <View
            style={[
              {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -60
              },
              Platform.OS === 'ios' && {
                paddingTop: Constants.statusBarHeight
              }
            ]}
          >
            <HeaderLogo width={SCREEN.width / 2} height={SCREEN.width / 2} />
            <View
              style={[
                globalStyles.SurfaceContainer,
                {
                  width: Platform.OS === 'ios' ? SCREEN.width * 0.8 : SCREEN.width * 0.9,
                  alignItems: 'center',
                  marginTop: 24,
                  position: 'absolute',
                  top: Platform.OS === 'android' ? '50%' : '75%',
                  zIndex: 1
                }
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 16,
                  paddingHorizontal: 16,
                  paddingTop: 16
                }}
              >
                <View
                  style={{
                    backgroundColor: theme.colors.primary,
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {auth.userInfo?.photoUrl ? (
                    <Image
                      source={{ uri: auth.userInfo?.photoUrl }}
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                    />
                  ) : (
                    <FontAwesome name='user' size={24} color='white' />
                  )}
                </View>
                <View style={{ gap: 2, flex: 1 }}>
                  <Text
                    style={[
                      globalStyles.text,
                      {
                        fontStyle: 'italic'
                      }
                    ]}
                  >
                    Xin chào,
                  </Text>
                  <Text
                    style={[
                      globalStyles.text,
                      {
                        fontWeight: 'bold',
                        fontSize: 18,
                        textTransform: 'capitalize'
                      }
                    ]}
                  >{`${auth.userInfo?.lastName} ${auth.userInfo?.firstName}`}</Text>
                </View>
              </View>
              <>
                <QueryTypeBtnTab selectedType={selectedType} setSelectedType={setSelectedType} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    flexWrap: 'wrap',
                    padding: 16
                  }}
                >
                  <StaffInfoCard
                    iconName='account-box'
                    itemName='Đơn hàng'
                    value={orderStatistic?.totalOrders || 0}
                  />
                  <StaffInfoCard
                    iconName='attach-money'
                    itemName='Phí Ship'
                    value={formatVNDcurrency(orderStatistic?.totalShippingFee || 0)}
                  />
                </View>
              </>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.dashboardContainer}>
        {/* {orders && orders.length > 0 && <StaffCurrentOrder order={orders[0]} />} */}
        <View>
          <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
            <Feather name='box' size={24} color='black' />
            <Text style={styles.sectionHeader}>Thống kê đơn hàng</Text>
          </View>
          <Barchart />
        </View>
        {/* delivery statistic */}
        <View>
          <View style={{ ...styles.rowWithGap, marginBottom: 8 }}>
            <FontAwesome name='bicycle' size={24} color='black' />
            <Text style={styles.sectionHeader}>Thống kê chuyến đi</Text>
          </View>
          <Barchart />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    paddingHorizontal: 24,
    flexDirection: 'column',
    gap: 16,
    marginTop: 32
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8
  },
  cardContent: {
    flexDirection: 'column',
    gap: 20
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
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

export default StaffDashBoard;
