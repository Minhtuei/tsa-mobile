import { useAppTheme } from '@hooks/theme';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';

export const Header = (props: NativeStackHeaderProps) => {
  const theme = useAppTheme();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    ['Dashboard', 'OrderList'].includes(props.route.name)
      ? setCanGoBack(false)
      : setCanGoBack(true);
  }, [props.route.name]);

  return canGoBack ? (
    <Appbar.Header
      statusBarHeight={Platform.OS === 'android' ? 0 : Constants.statusBarHeight}
      elevated={true}
      theme={theme}
    >
      {canGoBack && <Appbar.BackAction onPress={props.navigation.goBack} />}
      <Appbar.Content title={props.options.title ?? 'TSA Mobile'} />
    </Appbar.Header>
  ) : (
    <></>
  );
};
