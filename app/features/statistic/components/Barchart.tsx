import { useAppTheme } from 'app/shared/hooks/theme';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';
import { OrderStatistics } from '@slices/order.slice';

export const Barchart = ({
  resultByDay,
  type
}: {
  resultByDay: OrderStatistics['resultByDay'] | undefined;
  type: 'Order' | 'Delivery';
}) => {
  const theme = useAppTheme();

  const barData =
    resultByDay?.map((entry) => ({
      label: entry.period,
      value: type === 'Order' ? entry.orderCount : entry.deliveryCount,
      frontColor: theme.colors.primary
    })) || [];

  return (
    <View>
      <BarChart
        barWidth={40}
        spacing={30}
        noOfSections={3}
        barBorderRadius={4}
        frontColor='lightgray'
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        maxValue={Math.max(...barData.map((d) => d.value), 1)}
      />
      <Text style={{ textAlign: 'center', marginTop: 16 }}>
        Biểu đồ số lượng {type === 'Order' ? 'đơn hàng' : 'giao hàng'} theo ngày
      </Text>
    </View>
  );
};
