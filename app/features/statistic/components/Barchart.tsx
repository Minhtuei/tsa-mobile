import { useAppTheme } from 'app/shared/hooks/theme';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';

export const Barchart = () => {
  const theme = useAppTheme();
  const barData = [
    { value: 10, label: 'T2' },
    { value: 12, label: 'T3', frontColor: theme.colors.primary },
    { value: 6, label: 'T4' },
    { value: 5, label: 'T5' },
    { value: 3, label: 'T6' },
    { value: 1, label: 'T7' },
    { value: 2, label: 'CN' }
  ];
  return (
    <View>
      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor='lightgray'
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        maxValue={12}
      />
      <Text style={{ textAlign: 'center', marginTop: 16 }}>
        Biểu đồ số lượng đơn hàng theo tuần
      </Text>
    </View>
  );
};
