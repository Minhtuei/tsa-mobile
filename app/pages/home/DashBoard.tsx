import { SCREEN } from '@constants/screen';
import { useAppSelector } from '@hooks/redux';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import { Platform, ScrollView, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import QueryTypeBtnTab from '@components/QueryTypeBtnTab';
import InfoCard from './InfoCard';
import BackgroundIcon from '../../../assets/background-icon.svg';
export const Dashboard = () => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const auth = useAppSelector((state) => state.auth);

  const [selectedType, setSelectedType] = useState<'today' | 'week' | 'month'>(
    'today'
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[globalStyles.background]}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          zIndex: -1,
          opacity: 0.5,
          transform: [{ translateY: 200 }],
        }}
      >
        <Text
          style={[globalStyles.title, { marginTop: 24, textAlign: 'center' }]}
        >
          Bạn chưa có đơn hàng nào! Hãy tạo đơn hàng đầu tiên của bạn
        </Text>
        <BackgroundIcon width={SCREEN.width} height={SCREEN.height * 0.3} />
      </View>
    </ScrollView>
  );
};
