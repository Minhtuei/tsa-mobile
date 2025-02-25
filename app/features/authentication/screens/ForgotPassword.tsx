import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthNavigatorParamList, RootStackParamList } from 'app/shared/types/navigation';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const ForgotPassword = (
  props: NativeStackScreenProps<AuthNavigatorParamList, 'ForgotPassword'>
) => {
  return (
    <View>
      <Text>Bro it's a ForgotPassword !</Text>
    </View>
  );
};
