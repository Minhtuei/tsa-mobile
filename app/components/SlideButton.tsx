import React, { memo, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

export const SlideButton = memo(function SlideButton({
  onSlideComplete,
  title
}: {
  onSlideComplete: () => void;
  title: string;
}) {
  const [swipeBtnWidth, setSwipeBtnWidth] = useState(0);
  const xValue = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        xValue.value = 0;
      } else {
        xValue.value = e.translationX;
      }
    })
    .onEnd(() => {
      if (xValue.value < swipeBtnWidth / 2) {
        xValue.value = withSpring(0);
      } else {
        xValue.value = withSpring(swipeBtnWidth - 70);
        runOnJS(onSlideComplete)();
        xValue.value = withSpring(0);
      }
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: xValue.value }]
    };
  });
  return (
    <View
      onLayout={(e) => {
        setSwipeBtnWidth(e.nativeEvent.layout.width);
      }}
      style={{
        width: '90%',
        height: 60,
        backgroundColor: '#34A853',
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginHorizontal: '5%',
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 10
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              width: 50,
              height: 50,
              backgroundColor: '#FFFFFF',
              position: 'absolute',
              left: 10,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center'
            },
            animatedStyles
          ]}
        >
          <Feather name='chevrons-right' size={32} color='#34A853' />
        </Animated.View>
      </GestureDetector>
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
    </View>
  );
});
