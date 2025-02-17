import { StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { useAppTheme } from 'app/shared/hooks/theme';

export default function SettingButton({
  icon,
  text,
  onPress,
  right,
  disabled,
  loading
}: {
  icon: string;
  text: string;
  onPress?: () => void;
  right?: React.JSX.Element;
  disabled?: boolean;
  loading?: boolean;
}) {
  const theme = useAppTheme();

  return (
    <TouchableOpacity disabled={disabled} style={styles.settingButton} onPress={onPress}>
      {loading === true ? (
        <ActivityIndicator size={24} animating color={theme.colors.primary} />
      ) : (
        <Icon
          source={icon}
          size={24}
          color={disabled ? theme.colors.surfaceDisabled : theme.colors.primary}
        />
      )}
      <Text
        style={[
          styles.settingButtonContent,
          {
            color: disabled ? theme.colors.surfaceDisabled : theme.colors.onBackground
          }
        ]}
        variant='titleMedium'
      >
        {text}
      </Text>
      {right}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 48
  },
  settingButtonContent: {
    justifyContent: 'flex-start',
    flexGrow: 1,
    marginLeft: 16
  }
});
