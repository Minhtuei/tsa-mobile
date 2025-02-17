import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export const AuthSeparator = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  return (
    <View style={styles.separatorContainer}>
      <View style={[styles.separatorLine, { backgroundColor: theme.colors.outlineVariant }]} />
      <Text style={[globalStyles.text, styles.separatorText, { color: theme.colors.onSurface }]}>
        Hoặc
      </Text>
      <View style={[styles.separatorLine, { backgroundColor: theme.colors.outlineVariant }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  separatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  separatorLine: {
    flex: 0.5,
    height: 1
  },
  separatorText: {
    marginHorizontal: 8
  }
});
