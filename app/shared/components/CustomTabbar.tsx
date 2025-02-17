import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { Pressable, View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { memo, useEffect, useState } from 'react';
import { useAppTheme } from 'app/shared/hooks/theme';
import { Feather } from '@expo/vector-icons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useAppSelector } from 'app/shared/hooks/redux';
export function CustomTabbar({ state, descriptors, navigation }: BottomTabBarProps) {
  const theme = useAppTheme();
  const app = useAppSelector((state) => state.app);
  const [dimensions, setDimensions] = useState({ width: 20, height: 100 });
  const buttonWidth = dimensions.width / state.routes.length;
  const onLayoutUpdate = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };
  const tabPositionX = useSharedValue(0);
  useEffect(() => {
    tabPositionX.value = withTiming(buttonWidth * state.index + 8);
  }, [state.index]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }]
    };
  });
  if (app.isHideTabBar) {
    return null;
  }
  return (
    <View
      onLayout={onLayoutUpdate}
      style={[
        styles.tabbar,
        {
          backgroundColor: theme.colors.background
        }
      ]}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            backgroundColor: theme.colors.primary,
            borderRadius: 35,
            height: dimensions.height - 15,
            width: buttonWidth - 16
          },
          animatedStyle
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          });
        };

        return (
          <TabbarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            label={label as string}
            routeName={route.name}
            isFocused={isFocused}
            color={isFocused ? theme.colors.onPrimary : theme.colors.onBackground}
          />
        );
      })}
    </View>
  );
}
type TabbarButtonProps = {
  onPress: () => void;
  onLongPress: () => void;
  label: string;
  routeName: string;
  isFocused: boolean;
  color: string;
};
const TabbarButton = memo(function TabbarButton({
  onPress,
  onLongPress,
  label,
  routeName,
  isFocused,
  color
}: TabbarButtonProps) {
  const icon: {
    [key in 'Home' | 'Order' | 'Delivery' | 'Notification' | 'Account']: (
      props: any
    ) => JSX.Element;
  } = {
    Home: (props: any) => <Feather name='home' size={24} {...props} />,
    Order: (props: any) => <Feather name='shopping-bag' size={24} {...props} />,
    Delivery: (props: any) => <Feather name='truck' size={24} {...props} />,
    Notification: (props: any) => <Feather name='bell' size={24} {...props} />,
    Account: (props: any) => <Feather name='user' size={24} {...props} />
  };
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withTiming(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused);
  }, [scale, isFocused]);
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top
    };
  });
  const unreadCount = useAppSelector((state) => state.app.unReadNotificationCount);
  const formatNotificationCount = (count: number) => {
    if (count > 9) {
      return '9+';
    }
    return count;
  };

  const isShowBadge = routeName === 'Notification' && unreadCount > 0 && !isFocused;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabbarButton}>
      <Animated.View style={animatedIconStyle}>
        {icon[routeName as 'Home' | 'Order' | 'Delivery' | 'Notification' | 'Account']({
          color
        })}
        {/* Render the notification badge for the Notification tab */}
        {isShowBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{formatNotificationCount(unreadCount)}</Text>
          </View>
        )}
      </Animated.View>
      <Animated.Text style={[{ color, fontSize: 12 }, animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: '5%',
    bottom: 20,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    width: '90%'
  },
  tabbarButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 5
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 8,
    height: 16,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  }
});
