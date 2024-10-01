import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import Constants from 'expo-constants';
export const Header = (props: NativeStackHeaderProps) => {
  return (
    <Appbar.Header
      mode="center-aligned"
      statusBarHeight={
        Platform.OS === 'android' ? 0 : Constants.statusBarHeight
      }
    >
      <Appbar.BackAction
        onPress={() => props.navigation.goBack()}
        disabled={
          !props.navigation.canGoBack() || props.route.name === 'Dashboard'
        }
        style={{
          opacity:
            props.navigation.canGoBack() && !(props.route.name === 'Dashboard')
              ? 100
              : 0,
        }}
      />
      <Appbar.Content title={props.options.title ?? 'TSA Mobile'} />
    </Appbar.Header>
  );
};
