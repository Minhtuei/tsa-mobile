import {
  DASHBOARD_HEADER_HEIGHT,
  DashboardHeader,
} from '@components/DashboardHeader';
import { SCREEN } from '@constants/screen';
import { useGlobalStyles } from '@hooks/theme';
import { Platform, ScrollView, View, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import BackgroundIcon from '../../../assets/background-icon.svg';
import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import { useRef, useState } from 'react';
export const Dashboard = () => {
  const HIDE_TAB_HEIGHT = Platform.OS === 'ios' ? 100 : 50;

  const globalStyles = useGlobalStyles();
  const [selectedType, setSelectedType] = useState<
    'today' | 'yesterday' | 'week' | 'month'
  >('today');
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const millipedeOpacity = scrollY.interpolate({
    inputRange: [0, DASHBOARD_HEADER_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const stickyTop = scrollY.interpolate({
    inputRange: [DASHBOARD_HEADER_HEIGHT, DASHBOARD_HEADER_HEIGHT * 1.5],
    outputRange: [-HIDE_TAB_HEIGHT, 0],
    extrapolate: 'clamp',
  });
  const stickyOpacity = scrollY.interpolate({
    inputRange: [DASHBOARD_HEADER_HEIGHT, DASHBOARD_HEADER_HEIGHT * 1.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const InfoCardAnimation = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, DASHBOARD_HEADER_HEIGHT],
          outputRange: [0, DASHBOARD_HEADER_HEIGHT],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
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
        {/* 
        <View
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
        {Array.from({ length: 12 }).map((_, index) => (
          <Text
            key={index}
            style={[globalStyles.title, { marginTop: 24, textAlign: 'center' }]}
          >
            Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
          </Text>
        ))}
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
