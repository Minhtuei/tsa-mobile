import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Constants from 'expo-constants';
import { useAppTheme } from '@hooks/theme';
import HeaderLogo from '../../assets/tsa-header.svg';
const BackgroundImg = require('../../assets/header-background.png');
import { ImageBackground } from 'react-native';
import { SCREEN } from '@constants/screen';
import { DashboardHeader } from './DashboardHeader';

export const Header = (props: NativeStackHeaderProps) => {
  const theme = useAppTheme();
  const canGoBack = props.navigation.canGoBack();

  return (
    <>
      {canGoBack ? (
        <Appbar.Header
          statusBarHeight={
            Platform.OS === 'android' ? 0 : Constants.statusBarHeight
          }
          elevated={true}
          theme={theme}
        >
          {canGoBack && <Appbar.BackAction onPress={props.navigation.goBack} />}
          <Appbar.Content title={props.options.title ?? 'TSA Mobile'} />
        </Appbar.Header>
      ) : (
        <DashboardHeader />
      )}
    </>
  );
};
