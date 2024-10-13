import React from 'react';
import { ScrollView, ViewStyle, TextStyle, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAppTheme } from '@hooks/theme';

type QueryType = 'today' | 'yesterday' | 'week' | 'month';

interface QueryTypeBtnTabProps {
  selectedType: QueryType;
  setSelectedType: (type: QueryType) => void;
}

const QueryTypeBtnTab: React.FC<QueryTypeBtnTabProps> = ({
  selectedType,
  setSelectedType,
}) => {
  const theme = useAppTheme();

  const getButtonStyle = (type: QueryType): ViewStyle => ({
    borderWidth: 0,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderBottomColor:
      selectedType === type
        ? theme.colors.primary
        : theme.colors.outlineVariant,
  });

  const getLabelStyle = (type: QueryType): TextStyle => ({
    color:
      selectedType === type
        ? theme.colors.primary
        : theme.colors.outlineVariant,
  });

  return (
    <ScrollView
      horizontal={true}
      style={{ flexDirection: 'row', width: '100%', maxHeight: 50 }}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEventThrottle={16}
    >
      {['today', 'yesterday', 'week', 'month'].map((type) => (
        <View key={type} style={[getButtonStyle(type as QueryType)]}>
          <Button
            labelStyle={getLabelStyle(type as QueryType)}
            mode="outlined"
            onPress={() => {
              setSelectedType(type as QueryType);
            }}
            style={{ borderRadius: 0, borderWidth: 0 }}
          >
            {type === 'today'
              ? 'Hôm nay'
              : type === 'yesterday'
                ? 'Hôm qua'
                : type === 'week'
                  ? 'Tuần này'
                  : 'Tháng này'}
          </Button>
        </View>
      ))}
    </ScrollView>
  );
};

export default QueryTypeBtnTab;