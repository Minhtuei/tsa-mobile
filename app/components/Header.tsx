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
    if (['Dashboard', 'OrderList', 'ReportList'].includes(props.route.name)) {
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
      style={{ backgroundColor: theme.colors.primary }}
    >
      {canGoBack && (
        <Appbar.BackAction color={theme.colors.onPrimary} onPress={props.navigation.goBack} />
      )}
      <Appbar.Content
        titleStyle={{ color: theme.colors.onPrimary }}
        title={props.options.title ?? 'TSA Mobile'}
      />
    </Appbar.Header>
  ) : (
    <></>
  );
};
