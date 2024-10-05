import { SCREEN } from '@constants/screen';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from 'app/types/navigation';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SignIn = (
  props: NativeStackScreenProps<AuthStackParamList, 'SignIn'>
) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: theme.colors.primary,
        },
        Platform.OS === 'ios' && {
          top: -insets.top,
          minHeight: SCREEN.height + insets.top + insets.bottom,
        },
      ]}
    >
      <Text
        style={[
          globalStyles.text,
          styles.header,
          { color: theme.colors.onSurface, marginTop: insets.top + 16 },
        ]}
      >
        Đăng nhập
      </Text>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 16,
        }}
      >
        <Text style={globalStyles.text}>Chào mừng bạn đến với TSA</Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'semibold',
    padding: 16,
  },
});
