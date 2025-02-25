import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { getStatusRender } from 'app/shared/utils/order';
import { ReportType } from 'app/shared/types/report';
import moment from 'moment';
import { TouchableOpacity, View } from 'react-native';
import { Badge, Text } from 'react-native-paper';
export const ReportItem = ({ report, onPress }: { report: ReportType; onPress?: () => void }) => {
  const globalStyles = useGlobalStyles();
  const theme = useAppTheme();

  const statusRender = getStatusRender(report.status);
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={() => onPress?.()}
      style={globalStyles.SurfaceContainer}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            width: '100%',
            padding: 16,
            gap: 12,
            alignItems: 'center',
            height: 100
          }
        ]}
      >
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
          <MaterialIcons name='report' size={24} color={theme.colors.onPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[globalStyles.title, { color: theme.colors.onSurface }]}>
            {report.content}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <MaterialIcons
                name='schedule'
                size={18}
                color={theme.colors.onSurface}
                style={{ marginTop: 2 }}
              />
              <Text style={[globalStyles.text, { color: theme.colors.onSurface }]}>
                {moment.unix(Number(report.reportedAt)).format('DD/MM/YYYY')}
              </Text>
            </View>
            <Badge size={24} style={{ backgroundColor: statusRender.color }}>
              {statusRender.label}
            </Badge>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
