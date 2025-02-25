import { DASHBOARD_HEADER_HEIGHT, HIDE_TAB_HEIGHT } from 'app/shared/constants/screen';
import { Animated } from 'react-native';
export const getInterpolatedValues = (scrollY: Animated.Value) => {
  const millipedeOpacity = scrollY.interpolate({
    inputRange: [0, DASHBOARD_HEADER_HEIGHT / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const stickyTop = scrollY.interpolate({
    inputRange: [DASHBOARD_HEADER_HEIGHT, DASHBOARD_HEADER_HEIGHT * 1.5],
    outputRange: [-HIDE_TAB_HEIGHT, 0],
    extrapolate: 'clamp'
  });

  const stickyOpacity = scrollY.interpolate({
    inputRange: [DASHBOARD_HEADER_HEIGHT, DASHBOARD_HEADER_HEIGHT * 1.5],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const InfoCardAnimation = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, DASHBOARD_HEADER_HEIGHT],
          outputRange: [0, DASHBOARD_HEADER_HEIGHT],
          extrapolate: 'clamp'
        })
      }
    ]
  };

  return {
    millipedeOpacity,
    stickyTop,
    stickyOpacity,
    InfoCardAnimation
  };
};
