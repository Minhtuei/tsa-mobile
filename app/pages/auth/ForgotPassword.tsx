import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from 'app/types/navigation';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const ForgotPassword = (
  props: NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>
) => {
  return (
    <View>
      <Text>Bro it's a ForgotPassword !</Text>
    </View>
  );
};
