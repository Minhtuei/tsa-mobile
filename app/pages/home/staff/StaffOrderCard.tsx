import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface StaffOrderCardProps {
  color: string;
  numberOfOrders: number;
  title: string;
}

export const StaffOrderCard: React.FC<StaffOrderCardProps> = (props) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        gap: 4,
        height: 200,
        backgroundColor: props.color,
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16
      }}
    >
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 28
        }}
      >
        {props.numberOfOrders}
      </Text>
      <Text
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16
        }}
      >
        {props.title}
      </Text>
    </View>
  );
};
