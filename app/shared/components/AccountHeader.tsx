import { DASHBOARD_HEADER_HEIGHT, SCREEN } from 'app/shared/constants/screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppTheme } from 'app/shared/hooks/theme';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import HeaderLogo from '../../../assets/tsa-header.svg';
const BackgroundImg = require('../../../assets/header-background.png');

export const AccountHeader = ({
  onRightPress,
  backgroundUrl
}: {
  onRightPress: () => void;
  backgroundUrl: string | null | undefined;
}) => {
  const theme = useAppTheme();
  return (
    <ImageBackground
      style={{
        width: SCREEN.width,
        height: DASHBOARD_HEADER_HEIGHT / 1.2,
        position: 'absolute'
      }}
      blurRadius={1}
      resizeMethod='resize'
      resizeMode='cover'
      source={
        backgroundUrl
          ? {
              uri: backgroundUrl
            }
          : BackgroundImg
      }
    >
      {/* Overlay */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0, 0, 0, 0.5)' // Adjust the color and opacity as needed
        }}
      />
      {!backgroundUrl && (
        <HeaderLogo
          style={{
            alignSelf: 'center',
            position: 'absolute',
            top: '-10%'
          }}
          width={200}
          height={200}
        />
      )}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: '30%',
          right: 16
        }}
        onPress={onRightPress}
      >
        <AntDesign name='edit' size={32} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </ImageBackground>
  );
};
