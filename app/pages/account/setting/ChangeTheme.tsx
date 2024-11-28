import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalStyles } from '@hooks/theme';
import { Divider, Surface } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingStackParamList } from '../../../types/navigation';
import { Appearance, useColorScheme } from 'react-native';
import { useState } from 'react';
import SettingButton from '@components/SettingButton';
import { useAppSelector } from '@hooks/redux';

export const ChangeTheme = (
  props: NativeStackScreenProps<SettingStackParamList, 'ChangeTheme'>
) => {
  const styles = useGlobalStyles();
  const colorScheme = useColorScheme();
  const savedColorScheme = useAppSelector((state) => state.app.colorScheme);
  const [isSystemColor, setIsSystemColor] = useState(savedColorScheme === 'system');

  const handleChange = (color: 'dark' | 'light' | null) => {
    Appearance.setColorScheme(color);
    if (color) {
      setIsSystemColor(false);
      AsyncStorage.setItem('colorScheme', color);
    } else {
      setIsSystemColor(true);
      AsyncStorage.setItem('colorScheme', 'system');
    }
  };

  return (
    <Surface style={styles.fullScreen}>
      <SettingButton
        disabled={colorScheme === 'light' && !isSystemColor}
        onPress={() => handleChange('light')}
        icon='weather-sunny'
        text='Sáng'
      />
      <Divider />
      <SettingButton
        disabled={colorScheme === 'dark' && !isSystemColor}
        onPress={() => handleChange('dark')}
        icon='weather-night'
        text='Tối'
      />
      <Divider />
      <SettingButton
        disabled={isSystemColor}
        onPress={() => handleChange(null)}
        icon='cellphone'
        text='Hệ thống'
      />
    </Surface>
  );
};
