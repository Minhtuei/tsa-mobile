import createStyles, { lightTheme } from '@constants/style';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

type AppTheme = typeof lightTheme;
export const useAppTheme = () => useTheme<AppTheme>();

export const useGlobalStyles = () => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return styles;
};
