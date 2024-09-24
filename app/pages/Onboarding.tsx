import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'app/types/navigation';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const Onboarding = (
  props: NativeStackScreenProps<RootStackParamList, 'Onboarding'>
) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bro it's a onboarding !</Text>
    </View>
  );
};
