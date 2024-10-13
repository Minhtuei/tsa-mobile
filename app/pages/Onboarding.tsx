import { ONBOARDING_DATA, OnboardingDataType } from '@constants/onboarding';
import { useAppTheme } from '@hooks/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'app/types/navigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { OnboardFlow } from 'react-native-onboard';

type OnboardingProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: '80%',
    height: '40%',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});

const MODIFIED_ONBOARDING_DATA = ONBOARDING_DATA.map((item) => ({
  ...item,
  content: (
    <View style={styles.page}>
      <Text variant="titleLarge" style={styles.title}>
        {item.title}
      </Text>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <Text variant="bodyMedium" style={styles.subtitle}>
        {item.subtitle}
      </Text>
    </View>
  ),
}));

export const Onboarding = ({ navigation }: OnboardingProps) => {
  const theme = useAppTheme();

  const onFinish = async () => {
    await AsyncStorage.setItem('onboarding', 'true');
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'AuthStack' }] })
    );
  };

  return (
    <>
      <StatusBar
        style={theme.dark ? 'light' : 'dark'}
        backgroundColor={theme.colors.primaryContainer}
      />
      <SafeAreaView style={styles.container}>
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
        <OnboardFlow 
          pages={MODIFIED_ONBOARDING_DATA}
          onDone={onFinish}
          primaryButtonStyle={{ backgroundColor: 'green' }}
        />
      </SafeAreaView>
    </>
  );
};

