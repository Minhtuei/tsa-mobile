import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text } from 'react-native-paper';
import { getStepperStyles } from 'app/shared/constants/stepper';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import moment from 'moment';
import { getStatusRender } from 'app/shared/utils/order';

interface OrderStatusStepIndicatorProps {
  historyTime: { time: string; status: string }[];
  currentStatus: string;
}

const STATUSES = ['PENDING', 'ACCEPTED', 'IN_TRANSPORT', 'DELIVERED'];

const OrderStatusStepIndicator: React.FC<OrderStatusStepIndicatorProps> = ({
  historyTime,
  currentStatus
}) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();
  const [labelRendered, setLabelRendered] = useState(false);

  useEffect(() => {
    // Simulate a delay before enabling labels to render
    const timer = setTimeout(() => {
      setLabelRendered(true);
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  const getStepIndicatorIconConfig = ({
    position,
    stepStatus
  }: {
    position: number;
    stepStatus: string;
  }) => {
    if (!labelRendered) {
      return null;
    }
    const iconConfig: {
      name: 'pending-actions' | 'approval' | 'delivery-dining' | 'check' | 'feed';
      color: string;
      size: number;
    } = {
      name: 'feed',
      color: stepStatus === 'finished' ? theme.colors.onPrimary : theme.colors.primary,
      size: 15
    };
    switch (position) {
      case 0:
        iconConfig.name = 'pending-actions';
        break;
      case 1:
        iconConfig.name = 'approval';
        break;
      case 2:
        iconConfig.name = 'delivery-dining';
        break;
      case 3:
        iconConfig.name = 'check';
        break;
      default:
        break;
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
    const { position, currentPosition, label, stepStatus } = params;
    const [time, status] = label.split(' - ');

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 8
        }}
      >
        <Text
          style={[
            globalStyles.text,
            { width: 150, color: theme.colors.outlineVariant },
            position === currentPosition || stepStatus === 'finished'
              ? { color: theme.colors.onBackground }
              : {}
          ]}
        >
          {
            getStatusRender(
              status as
                | 'PENDING'
                | 'ACCEPTED'
                | 'REJECTED'
                | 'DELIVERED'
                | 'CANCELED'
                | 'IN_TRANSPORT'
                | 'REPLIED'
            ).label
          }
        </Text>
        {time && (
          <Text style={[globalStyles.text, { textAlign: 'right' }]}>
            {moment.unix(Number(time)).format('DD/MM/YYYY HH:mm')}
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
        currentPosition={STATUSES.indexOf(currentStatus)}
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
