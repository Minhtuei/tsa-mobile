import { DashboardHeader } from '@components/DashboardHeader';
import {
  DASHBOARD_HEADER_HEIGHT,
  HIDE_TAB_HEIGHT,
  SCREEN,
} from '@constants/screen';
import { useGlobalStyles } from '@hooks/theme';
import { Platform, ScrollView, View, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import BackgroundIcon from '../../../assets/background-icon.svg';
import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import { useRef, useState } from 'react';
import { getInterpolatedValues } from '@utils/scrollAnimationValues';
import { useGetOrdersQuery } from '@services/order.service';
export const Dashboard = () => {
  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<
    'today' | 'yesterday' | 'week' | 'month'
  >('today');
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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <DashboardHeader
          animation={InfoCardAnimation}
          opacity={millipedeOpacity}
        />

        {/* <View
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            zIndex: -1,
            opacity: 0.5,
            transform: [{ translateY: 200 }],
          }}
        >
          <Text
            style={[globalStyles.title, { marginTop: 24, textAlign: 'center' }]}
          >
            Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
          </Text>
          <BackgroundIcon width={SCREEN.width} height={SCREEN.height * 0.3} />
        </View> */}
      </ScrollView>
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
              elevation: 3,
            },
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            },
          }),
        }}
      >
        <QueryTypeBtnTab
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </Animated.View>
    </View>
  );
};
