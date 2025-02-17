import { useAppTheme } from 'app/shared/hooks/theme';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export const LoadingScreen = () => {
  const theme = useAppTheme();
  return (
    <View
      style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the color and opacity as needed
        width: '100%',
        height: '100%'
      }}
    >
      <ActivityIndicator size='large' color={theme.colors.primary} />
    </View>
  );
};
