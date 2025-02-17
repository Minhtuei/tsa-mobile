import { useAppTheme } from 'app/shared/hooks/theme';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
export const Header = (props: NativeStackHeaderProps) => {
  const theme = useAppTheme();
  const isAccountScreen = props.route.name === 'AccountScreen';
  const [canGoBack, setCanGoBack] = useState(false);
  const backgroundColor = theme.colors.primary;
  const color = theme.colors.onPrimary;
  useEffect(() => {
    if (
      ['Dashboard', 'OrderList', 'ReportList', 'Report', 'AccountScreen', 'DeliveryList'].includes(
        props.route.name
      )
    ) {
      setCanGoBack(false);
    } else {
      setCanGoBack(true);
    }
  }, [props.route.name]);

  return canGoBack ? (
    <Appbar.Header
      statusBarHeight={Platform.OS === 'android' ? 0 : Constants.statusBarHeight}
      elevated={true}
      theme={theme}
      style={{ backgroundColor: backgroundColor }}
    >
      {props.route.name !== 'NotificationList' && (
        <Appbar.BackAction color={color} onPress={props.navigation.goBack} />
      )}

      <Appbar.Content titleStyle={{ color: color }} title={props.options.title ?? 'TSA Mobile'} />
    </Appbar.Header>
  ) : (
    <></>
  );
};
