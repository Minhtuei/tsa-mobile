import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface StaffDeliveryCardProps {
  color: string;
  numberOfDeliveries: number;
  title: string;
}

export const StaffDeliveryCard: React.FC<StaffDeliveryCardProps> = (props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: props.color,
        height: 60,
        borderRadius: 16
      }}
    >
      <Text style={styles.text}>{props.numberOfDeliveries}</Text>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24
  }
});
