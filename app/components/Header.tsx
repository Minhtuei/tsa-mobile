import { useAppTheme } from '@hooks/theme';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Appbar } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
export const Header = (props: NativeStackHeaderProps) => {
  const theme = useAppTheme();
  const isAccountScreen = props.route.name === 'AccountScreen';
  const [canGoBack, setCanGoBack] = useState(false);
  const backgroundColor = !isAccountScreen ? theme.colors.primary : theme.colors.surface;
  const color = !isAccountScreen ? theme.colors.onPrimary : theme.colors.onSurface;

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
      elevated={Boolean(!isAccountScreen)}
      theme={theme}
      style={{ backgroundColor: backgroundColor }}
    >
      {canGoBack && <Appbar.BackAction color={color} onPress={props.navigation.goBack} />}

      <Appbar.Content titleStyle={{ color: color }} title={props.options.title ?? 'TSA Mobile'} />
      {isAccountScreen && (
        <TouchableOpacity style={{ marginRight: 10 }}>
          <MaterialCommunityIcons name='pencil' size={24} color={color} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  ) : (
    <></>
  );
};
