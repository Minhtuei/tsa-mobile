import Constants from 'expo-constants';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { MD3Theme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const SCREEN_WITH = Dimensions.get('window').width;

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    primary: '#34A853',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(223, 224, 255)',
    onPrimaryContainer: 'rgb(0, 13, 95)',
    secondary: 'rgb(91, 93, 114)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(227, 227, 227)',
    onSecondaryContainer: 'rgb(24, 26, 44)',
    tertiary: 'rgb(119, 83, 108)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 215, 240)',
    onTertiaryContainer: 'rgb(45, 18, 39)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(27, 27, 31)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(27, 27, 31)',
    surfaceVariant: 'rgb(227, 225, 236)',
    onSurfaceVariant: 'rgb(70, 70, 79)',
    outline: 'rgb(118, 118, 128)',
    outlineVariant: 'rgb(199, 197, 208)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(48, 48, 52)',
    inverseOnSurface: 'rgb(243, 240, 244)',
    inversePrimary: 'rgb(187, 195, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(246, 243, 251)',
      level2: 'rgb(240, 238, 249)',
      level3: 'rgb(235, 233, 247)',
      level4: 'rgb(233, 231, 246)',
      level5: 'rgb(229, 228, 245)',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(47, 48, 56, 0.4)',
    success: 'rgb(0, 109, 50)',
    onSuccess: 'rgb(255, 255, 255)',
    successContainer: 'rgb(137, 250, 162)',
    onSuccessContainer: 'rgb(0, 33, 10)',
    warning: 'rgb(120, 89, 0)',
    onWarning: 'rgb(255, 255, 255)',
    warningContainer: 'rgb(255, 223, 158)',
    onWarningContainer: 'rgb(38, 26, 0)',
    text: 'rgb(255, 255, 255)',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    primary: 'rgb(187, 195, 255)',
    onPrimary: 'rgb(17, 34, 134)',
    primaryContainer: 'rgb(45, 60, 156)',
    onPrimaryContainer: 'rgb(223, 224, 255)',
    secondary: 'rgb(196, 197, 221)',
    onSecondary: 'rgb(45, 47, 66)',
    secondaryContainer: 'rgb(67, 69, 89)',
    onSecondaryContainer: 'rgb(224, 225, 249)',
    tertiary: 'rgb(230, 186, 215)',
    onTertiary: 'rgb(69, 38, 61)',
    tertiaryContainer: 'rgb(93, 60, 84)',
    onTertiaryContainer: 'rgb(255, 215, 240)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 180, 171)',
    background: 'rgb(27, 27, 31)',
    onBackground: 'rgb(228, 225, 230)',
    surface: 'rgb(27, 27, 31)',
    onSurface: 'rgb(228, 225, 230)',
    surfaceVariant: 'rgb(70, 70, 79)',
    onSurfaceVariant: 'rgb(199, 197, 208)',
    outline: 'rgba(118, 118, 118)',
    outlineVariant: 'rgb(70, 70, 79)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(228, 225, 230)',
    inverseOnSurface: 'rgb(48, 48, 52)',
    inversePrimary: 'rgb(71, 85, 182)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(35, 35, 42)',
      level2: 'rgb(40, 40, 49)',
      level3: 'rgb(45, 46, 56)',
      level4: 'rgb(46, 47, 58)',
      level5: 'rgb(49, 51, 62)',
    },
    surfaceDisabled: 'rgba(228, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(228, 225, 230, 0.38)',
    backdrop: 'rgba(47, 48, 56, 0.4)',
    success: 'rgb(109, 221, 136)',
    onSuccess: 'rgb(0, 57, 23)',
    successContainer: 'rgb(0, 83, 36)',
    onSuccessContainer: 'rgb(137, 250, 162)',
    warning: 'rgb(250, 189, 0)',
    onWarning: 'rgb(63, 46, 0)',
    warningContainer: 'rgb(91, 67, 0)',
    onWarningContainer: 'rgb(255, 223, 158)',
    text: 'rgb(44, 44, 44)',
  },
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flexGrow: 1,
    },
    auth: {
      paddingVertical: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 16,
    },
    title: {
      marginVertical: 32,
      textAlign: 'center',
    },
    error: {
      color: theme.colors.error,
      marginBottom: 4,
    },
    fullScreen: {
      padding: 16,
      height: '100%',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    vstack: {
      width: '100%',
      alignItems: 'center',
      gap: 8,
    },
    hstack: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStack: {
      width: '100%',
      alignItems: 'flex-start',
    },
    input: {
      width: '100%',
      marginBottom: 8,
    },
    modal: {
      padding: 24,
      margin: 24,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      gap: 8,
    },
    wideButton: {
      width: '80%',
      padding: 2,

      alignItems: 'stretch',
    },
    mediumButton: {
      width: '50%',
      marginVertical: 8,
    },
    smallButton: {
      marginVertical: 4,
      fontSize: 12,
    },
    footer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    bankSurface: {
      padding: 12,
      margin: 4,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
    },
    icon: {
      height: 32,
      width: 32,
      marginRight: 12,
    },
    bigIcon: {
      height: 48,
      width: 48,
      marginRight: 12,
    },
    bankText: {
      flexGrow: 1,
      width: SCREEN_WITH - 160,
    },
    touchable: {
      alignItems: 'center',
      flexDirection: 'row',
      flexGrow: 1,
    },
    deviceSurface: {
      padding: 12,
      margin: 8,
      borderRadius: 12,
    },
    selectableContainer: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    bankLogo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    smallIcon: {
      height: 20,
      width: 20,
      marginRight: 8,
    },
    deviceText: {
      width: '60%',
    },
    bankInfo: {
      alignItems: 'flex-end',
      alignSelf: 'flex-start',
      width: '40%',
    },
    deviceAction: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
      gap: 8,
    },
    tutorial: {
      margin: 'auto',
      height: '100%',
      paddingBottom: 100,
      opacity: 0.5,
      gap: 16,
    },
    check: {
      width: '45%',
    },
    delete: {
      width: '30%',
    },
    text: {
      fontSize: 16,
      fontFamily: 'Roboto',
    },
    iconContainer: {
      borderRadius: 100,
      width: 48,
      aspectRatio: '1/1',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
    },
  });

export default createStyles;
