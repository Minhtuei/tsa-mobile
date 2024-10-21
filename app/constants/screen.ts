import { Dimensions, Platform } from 'react-native';
export const SCREEN = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};
export const HIDE_TAB_HEIGHT = Platform.OS === 'ios' ? 100 : 50;

export const DASHBOARD_HEADER_HEIGHT = SCREEN.height * 0.25;
