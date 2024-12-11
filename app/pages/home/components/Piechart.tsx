import { useAppTheme } from '@hooks/theme';
import { View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Text } from 'react-native-paper';

export const Piechart = () => {
  const theme = useAppTheme();
  const pieData = [
    {
      value: 72,
      color: '#FF6600',
      focused: true
    },
    { value: 16, color: '#333' },
    { value: 10, color: '#006DFF' },
    { value: 2, color: '#FF7F97' }
  ];

  const renderDot = (color: string) => {
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
  };

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20
            }}
          >
            {renderDot('#FF6600')}
            <Text style={{ color: theme.colors.onBackground }}>Shopee: 72%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#333')}
            <Text style={{ color: theme.colors.onBackground }}>Tiktok: 16%</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: 120,
              marginRight: 20
            }}
          >
            {renderDot('#006DFF')}
            <Text style={{ color: theme.colors.onBackground }}>Lazada: 10%</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
            {renderDot('#FF7F97')}
            <Text style={{ color: theme.colors.onBackground }}>Khác: 2%</Text>
          </View>
        </View>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 12,
            color: theme.colors.onBackground
          }}
        >
          Biểu đồ phân bố nguồn đơn hàng
        </Text>
      </>
    );
  };

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
          innerCircleColor={theme.colors.primary}
          centerLabelComponent={() => {
            return (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>72%</Text>
                <Text style={{ fontSize: 14, color: 'white' }}>Shopee</Text>
              </View>
            );
          }}
        />
      </View>
      {renderLegendComponent()}
    </View>
  );
};
