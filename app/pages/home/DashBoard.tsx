import { DashboardHeader } from '@components/DashboardHeader';
import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import { HIDE_TAB_HEIGHT } from '@constants/screen';
import { useAppSelector } from '@hooks/redux';
import { useGlobalStyles } from '@hooks/theme';
import { getInterpolatedValues } from '@utils/scrollAnimationValues';
import * as SplashScreenExpo from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Platform, ScrollView, View } from 'react-native';
import { StaffDashBoard } from './staff/StaffDashBoard';
import { useRegisterPushNotiMutation } from '@services/notification.service';
import { useNotification } from 'app/context/NotificationContext';
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
  const [registerPushNoti] = useRegisterPushNotiMutation();
  const { deviceToken } = useNotification();
  useEffect(() => {
    if (deviceToken && auth.userInfo) {
      console.log({
        token: deviceToken,
        userId: auth.userInfo.id,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
      });
      registerPushNoti({
        token: deviceToken,
        userId: auth.userInfo.id,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID'
      })
        .then((res) => {
          console.log('Register push noti success', res);
        })
        .catch((err) => {
          console.log('Register push noti failed', err);
        });
    }
  }, [deviceToken]);
  const onLayoutRootView = useCallback(async () => {
    await SplashScreenExpo.hideAsync();
  }, []);

  return (
    <View style={[globalStyles.background]} onLayout={onLayoutRootView}>
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
                    elevation: 14
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
