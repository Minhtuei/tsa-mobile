import { StyleSheet, TouchableOpacity, View } from 'react-native';
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
    <TouchableOpacity
      disabled={disabled}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {loading ? (
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
            {
              color: disabled ? theme.colors.surfaceDisabled : theme.colors.onBackground
            }
          ]}
          variant='titleMedium'
        >
          {text}
        </Text>
      </View>

      {right && (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>{right}</View>
      )}
    </TouchableOpacity>
  );
}
