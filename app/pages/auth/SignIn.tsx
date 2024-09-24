import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from 'app/types/navigation';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const SignIn = (
  props: NativeStackScreenProps<AuthStackParamList, 'SignIn'>
) => {
  return (
    <View>
      <Text>Bro it's a login !</Text>
    </View>
  );
};
