import { useAppTheme } from 'app/shared/hooks/theme';
import { OrderStatistics } from 'app/shared/state/order.slice';
import { getBrandColor } from 'app/shared/utils/getBrandIcon';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';

export const Piechart = ({ data }: { data: OrderStatistics['brandPercentages'] | undefined }) => {
  const theme = useAppTheme();
  const mostUsedBrand = useMemo(() => {
    if (!data) return null;
    // return the brand with the highest percentage and count
    return data.reduce((prev, current) => (prev.percentage > current.percentage ? prev : current));
  }, [data]);
  const pieData = useMemo(() => {
    if (!data) return [];
    return data.map((value) => {
      return {
        value: value.count,
        color: getBrandColor(value.brand),
        focused: value.brand === mostUsedBrand?.brand
      };
    });
  }, [data, mostUsedBrand]);
  const renderDot = useCallback((color: string) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10
        }}
      />
    );
  }, []);
  const renderLegendComponent = useCallback(() => {
    if (!data || data.length === 0) return null;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {data.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              marginBottom: 10,
              marginRight: 20
            }}
          >
            {renderDot(getBrandColor(item.brand))}
            <Text style={{ color: theme.colors.onBackground }}>
              {item.brand}: {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    );
  }, [data, renderDot, theme.colors.onBackground]);
  return (
    <View
      style={{
        flex: 1,
        marginTop: 24
      }}
    >
      <View style={{ padding: 20, alignItems: 'center' }}>
        <PieChart
          data={pieData}
          donut
          sectionAutoFocus
          radius={90}
          innerRadius={60}
          innerCircleColor={
            mostUsedBrand ? getBrandColor(mostUsedBrand.brand) : theme.colors.background
          }
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                  {mostUsedBrand?.percentage}%
                </Text>
                <Text style={{ fontSize: 14, color: 'white' }}>{mostUsedBrand?.brand}</Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
  );
};
