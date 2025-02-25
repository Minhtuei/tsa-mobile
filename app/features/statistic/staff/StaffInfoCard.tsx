import React, { memo } from 'react';
import { View, ViewStyle, TextStyle, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { SCREEN } from 'app/shared/constants/screen';
interface InfoCardProps extends ViewProps {
  iconName: keyof typeof MaterialIcons.glyphMap;
  itemName: string;
  value: string | number;
}

export const StaffInfoCard: React.FC<InfoCardProps> = memo(function StaffInfoCard({
  iconName,
  itemName,
  value,
  ...props
}) {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const containerStyle: ViewStyle = {
    padding: SCREEN.width * 0.025,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    gap: 8,
    flex: 0.45,
    opacity: 0.9
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  };

  const itemTextStyle: TextStyle = {
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
    flex: 1
  };

  const valueTextStyle: TextStyle = {
    color: theme.colors.onPrimary,
    fontSize: 18
  };

  return (
    <View style={containerStyle} {...props}>
      <View style={rowStyle}>
        <MaterialIcons name={iconName} size={24} color={theme.colors.onPrimary} />
        <Text numberOfLines={2} style={[globalStyles.text, itemTextStyle]}>
          {itemName}
        </Text>
      </View>
      <Text numberOfLines={2} style={[globalStyles.text, valueTextStyle]}>
        {value}
      </Text>
    </View>
  );
});
