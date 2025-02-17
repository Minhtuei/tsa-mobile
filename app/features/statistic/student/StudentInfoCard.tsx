import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface StudentInfoCardProps {
  color: string;
  numberOfOrders: number | undefined;
  title: string;
}

export const StudentInfoCard = memo(function StudentInfoCard(props: StudentInfoCardProps) {
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
        {props.numberOfOrders || 0}
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
});
