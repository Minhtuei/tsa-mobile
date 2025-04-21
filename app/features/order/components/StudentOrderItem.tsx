import Feather from '@expo/vector-icons/Feather';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { getBrandIcon } from 'app/shared/utils/getBrandIcon';
import { getStatusRender } from 'app/shared/utils/order';
import { Order } from 'app/shared/types/order';
import moment from 'moment';
import { Image, TouchableOpacity, View } from 'react-native';
import { Badge, Text } from 'react-native-paper';
import { formatDate, formatTimeslotFromTimestamp, formatUnixTimestamp } from '@utils/format';

export const StudentOrderItem = ({ order, onPress }: { order: Order; onPress?: () => void }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const statusRender = getStatusRender(order.latestStatus);
  const formatedTimeslot =
    formatTimeslotFromTimestamp(order.deliveryDate) ??
    formatDate(formatUnixTimestamp(order.deliveryDate));
  const deliveryDate = formatedTimeslot?.split(' ')[0];
  const timeslot = formatedTimeslot?.split(' ')[1];
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => onPress?.()}
      style={[globalStyles.SurfaceContainer]}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            width: '100%',
            padding: 16,
            gap: 12,
            alignItems: 'center',
            height: 120
          }
        ]}
      >
        {order.brand ? (
          <Image
            source={getBrandIcon(order.brand)}
            style={{ width: 48, height: 48, borderRadius: 10 }}
          />
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.primary,
              padding: 8,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              width: 48,
              height: 48
            }}
          >
            <Feather name='package' size={24} color={theme.colors.onPrimary} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 4
            }}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[globalStyles.title, { color: theme.colors.onSurface }]}>
                {order.checkCode}
              </Text>

              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Feather name='calendar' size={18} color={theme.colors.onSurface} />
                <Text style={[globalStyles.text, { color: theme.colors.onSurface }]}>
                  {deliveryDate}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Feather name='clock' size={18} color={theme.colors.onSurface} />
                <Text style={[globalStyles.text, { color: theme.colors.onSurface }]}>
                  {timeslot}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Feather name='home' size={18} color={theme.colors.onSurface} />
                <Text style={[globalStyles.text, { color: theme.colors.onSurface }]}>
                  {`${order.building} - ${order.room}`}
                </Text>
              </View>
            </View>
            <Badge size={24} style={{ backgroundColor: statusRender.color, alignSelf: 'center' }}>
              {statusRender.label}
            </Badge>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
