import createStyles, { lightTheme } from 'app/shared/constants/style';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export type AppTheme = typeof lightTheme;
export const useAppTheme = () => useTheme<AppTheme>();

export const useGlobalStyles = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return styles;
};
