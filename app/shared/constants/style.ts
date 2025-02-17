import Constants from 'expo-constants';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
const SCREEN_WITH = Dimensions.get('window').width;

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    primary: 'rgba(52, 168, 83, 1)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgba(91, 226, 61, 1)',
    onPrimaryContainer: 'rgb(255,255,255)',
    secondary: 'rgba(148, 163, 184, 1)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgba(66, 133, 244, 1)',
    onSecondaryContainer: 'rgb(255, 255, 255)',
    tertiary: 'rgb(255, 255, 255)',
    onTertiary: 'rgb(0,0,0)',
    tertiaryContainer: 'rgba(148, 163, 184, 1)',
    onTertiaryContainer: 'rgb(0, 0, 0)',
    error: 'rgba(251,2,9,1)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 255, 255)',
    onBackground: 'rgb(0, 0, 0)',
    surface: 'rgb(255, 255, 255)',
    onSurface: 'rgb(0, 0, 0)',
    surfaceVariant: 'rgba(241, 244, 245, 1)',
    onSurfaceVariant: 'rgba(15, 23, 42, 1)',
    outline: 'rgba(51, 51, 51, 1)',
    outlineVariant: 'rgba(102,102,102,0.25)',
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
      level5: 'rgb(229, 228, 245)'
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
    onWarningContainer: 'rgb(38, 26, 0)'
  }
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
    surface: 'rgb(2, 27, 31)',
    onSurface: 'rgb(228, 225, 230)',
    surfaceVariant: 'rgb(70, 70, 79)',
    onSurfaceVariant: 'rgb(199, 197, 208)',
    outline: 'rgba(0, 0, 0, 0.3)',
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
      level5: 'rgb(49, 51, 62)'
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
    onWarningContainer: 'rgb(255, 223, 158)'
  }
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    keyboardAvoidingView: {
      flexGrow: 1,
      backgroundColor: theme.colors.background
    },
    auth: {
      paddingVertical: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 16
    },

    error: {
      color: theme.colors.error,
      marginBottom: 4
    },
    fullScreen: {
      padding: 16,
      height: '100%'
    },
    background: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    vstack: {
      width: '100%',
      alignItems: 'center',
      gap: 8
    },
    hstack: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputStack: {
      width: '100%',
      alignItems: 'flex-start'
    },
    input: {
      width: '100%',
      marginBottom: 8
    },
    modal: {
      padding: 24,
      margin: 24,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      gap: 8
    },
    wideButton: {
      width: '100%',
      padding: 2,

      alignItems: 'stretch'
    },
    mediumButton: {
      width: '80%',
      marginVertical: 8
    },
    smallButton: {
      marginVertical: 4,
      fontSize: 12
    },
    text: {
      color: theme.colors.onSurface,
      fontFamily: 'Roboto',
      fontSize: 16
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Roboto'
    },
    SurfaceContainer: {
      alignSelf: 'center',
      borderRadius: 10,
      backgroundColor: theme.colors.background,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 14
    }
  });

export default createStyles;
