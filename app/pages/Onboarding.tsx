import { ONBOARDING_DATA, OnboardingDataType } from '@constants/onboarding';
import { SCREEN } from '@constants/screen';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'app/types/navigation';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, IconButton, Surface, Text } from 'react-native-paper';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import Carousel from 'react-native-reanimated-carousel';
export const Onboarding = (
  props: NativeStackScreenProps<RootStackParamList, 'Onboarding'>
) => {
  const caroselRef = useRef<ICarouselInstance>(null);
  const theme = useAppTheme();
  const [index, setIndex] = useState(0);
  const onFinish = async () => {
    await AsyncStorage.setItem('onboarding', 'true');
    props.navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'AuthStack' }] })
    );
  };
  return (
    <>
      <StatusBar
        style={theme.dark ? 'light' : 'dark'}
        backgroundColor={theme.colors.primaryContainer}
      />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
      >
        <Button
          style={{ alignSelf: 'flex-end' }}
          labelStyle={{
            color: '#34A853',
            fontFamily: 'Roboto',
            fontSize: 16,
          }}
          onPress={onFinish}
        >
          Bỏ qua
        </Button>
        <Carousel
          ref={caroselRef}
          width={SCREEN.width}
          data={ONBOARDING_DATA}
          renderItem={({ item }) => (
            <CarouselItem
              item={item}
              last={item.key === ONBOARDING_DATA.length}
              onFinish={onFinish}
            />
          )}
          onProgressChange={(progress, absolute) => {
            if (index !== Math.round(absolute)) {
              setIndex(Math.round(absolute));
            }
          }}
          loop={false}
        />
        <View style={styles.pagination}>
          <IconButton
            icon="chevron-left"
            onPress={() => caroselRef.current?.prev()}
            disabled={index === 0}
            iconColor={theme.colors.primary}
          />
          {ONBOARDING_DATA.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === index ? theme.colors.primary : theme.colors.surface,
                },
              ]}
            ></View>
          ))}
          <IconButton
            icon="chevron-right"
            onPress={() => caroselRef.current?.next()}
            disabled={index === ONBOARDING_DATA.length - 1}
            iconColor={theme.colors.primary}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
const CarouselItem = ({
  item,
  last,
  onFinish,
}: {
  item: OnboardingDataType;
  last?: boolean;
  onFinish: () => void;
}) => {
  const globalStyles = useGlobalStyles();
  return (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="center"
        resizeMethod="scale"
      />
      <Text variant="titleLarge" style={[styles.text, { fontWeight: 700 }]}>
        {item.title}
      </Text>
      <Text variant="bodyMedium" style={styles.text}>
        {item.description}
      </Text>
      {last && (
        <Button
          mode="contained"
          onPress={onFinish}
          style={globalStyles.wideButton}
        >
          Bắt đầu
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  image: {
    width: SCREEN.width * 0.8,
    height: SCREEN.width * 0.8,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: 32,
    fontFamily: 'Roboto',
    fontSize: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SCREEN.width * 0.02,
    height: SCREEN.height * 0.2,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 50,
  },
});
