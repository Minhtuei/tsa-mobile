import { DashboardHeader } from '@components/DashboardHeader';
import { DASHBOARD_HEADER_HEIGHT, HIDE_TAB_HEIGHT } from '@constants/screen';
import { StaffDashBoard } from './staff/StaffDashBoard';
import { useGlobalStyles } from '@hooks/theme';
import { Platform, ScrollView, View, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import BackgroundIcon from '../../../assets/background-icon.svg';
import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import { useRef, useState } from 'react';
import { getInterpolatedValues } from '@utils/scrollAnimationValues';
import { useGetOrdersQuery } from '@services/order.service';
import { useAppSelector } from '@hooks/redux';
export const Dashboard = () => {
  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<'today' | 'yesterday' | 'week' | 'month'>(
    'today'
  );
  const auth = useAppSelector((state) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { millipedeOpacity, stickyTop, stickyOpacity, InfoCardAnimation } =
    getInterpolatedValues(scrollY);
  const { data, isLoading, isError, refetch, error } = useGetOrdersQuery();
  return (
    <View style={[globalStyles.background]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false
        })}
        scrollEventThrottle={16}
      >
        <DashboardHeader animation={InfoCardAnimation} opacity={millipedeOpacity} />
        {auth.userInfo?.role === 'STUDENT' && (
          <>
            {Array.from({ length: 12 }).map((_, index) => (
              <Text
                key={index}
                style={[globalStyles.title, { marginTop: 24, textAlign: 'center' }]}
              >
                Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
              </Text>
            ))}
            <Animated.View
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: 'white',
                justifyContent: 'flex-end',
                top: stickyTop,
                left: 0,
                right: 0,
                opacity: stickyOpacity,
                height: HIDE_TAB_HEIGHT,
                position: 'absolute',
                ...Platform.select({
                  android: {
                    elevation: 3
                  },
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84
                  }
                })
              }}
            >
              <QueryTypeBtnTab selectedType={selectedType} setSelectedType={setSelectedType} />
            </Animated.View>
          </>
        )}
        {auth.userInfo?.role === 'STAFF' && <StaffDashBoard />}
      </ScrollView>
    </View>
  );
};
