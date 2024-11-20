import React from 'react';
import { View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from 'react-native-paper';
import { getStepperStyles } from '@constants/stepper';
import { useAppTheme, useGlobalStyles } from '@hooks/theme';
import moment from 'moment';
import { getStatusRender } from '@utils/order';

interface OrderStatusStepIndicatorProps {
  historyTime: { time: string; status: string }[];
}

const STATUSES = ['PENDING', 'ACCEPTED', 'IN_TRANSPORT', 'COMPLETED'];

const OrderStatusStepIndicator: React.FC<OrderStatusStepIndicatorProps> = ({ historyTime }) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const getStepIndicatorIconConfig = ({
    position,
    stepStatus
  }: {
    position: number;
    stepStatus: string;
  }) => {
    const iconConfig: {
      name: 'feed' | 'pending-actions' | 'approval' | 'delivery-dining' | 'check';
      color: string;
      size: number;
    } = {
      name: 'feed',
      color: stepStatus === 'finished' ? theme.colors.onPrimary : theme.colors.primary,
      size: 15
    };
    switch (position) {
      case 0: {
        iconConfig.name = 'pending-actions';
        break;
      }
      case 1: {
        iconConfig.name = 'approval';
        break;
      }
      case 2: {
        iconConfig.name = 'delivery-dining';
        break;
      }
      case 3: {
        iconConfig.name = 'check';
        break;
      }

      default: {
        break;
      }
    }
    return iconConfig;
  };

  const renderStepIndicator = (params: any) => (
    <MaterialIcons {...getStepIndicatorIconConfig(params)} />
  );

  const renderLabel = (params: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    const { position, currentPosition, label } = params;
    const [time, status] = label.split(' - ');
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          transform: [
            { translateY: position !== currentPosition ? -6 * (4 - position) : -10 },
            {
              translateX: 16
            }
          ]
        }}
      >
        <Text
          style={[
            globalStyles.text,
            position !== currentPosition && { color: theme.colors.outlineVariant }
          ]}
        >
          {getStatusRender(status).label}
        </Text>
        {time && (
          <Text style={[globalStyles.text, { flex: 1, textAlign: 'right' }]}>
            {moment.unix(Number(time)).format('HH:mm')}
          </Text>
        )}
      </View>
    );
  };

  // Map the historyTime data to the defined statuses
  const mappedHistoryTime = STATUSES.map((status) => {
    const historyItem = historyTime.find((item) => item.status === status);
    return historyItem || { time: '', status };
  });

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={getStepperStyles('flex-start')}
        currentPosition={0}
        stepCount={4}
        renderStepIndicator={renderStepIndicator}
        direction='vertical'
        renderLabel={renderLabel}
        labels={mappedHistoryTime.map((item) => `${item.time} - ${item.status}`)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '60%'
  }
});

export default OrderStatusStepIndicator;
