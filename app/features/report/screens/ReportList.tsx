import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetReportsQuery } from '../api/report.api';
import { getErrorMessage } from 'app/shared/utils/helper';
import { ReportStackParamList } from 'app/shared/types/navigation';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import { ReportItem } from '../components/ReportItem';
import { HeaderWithSearchAndFilter } from 'app/shared/components/HeaderWithSearchAndFilter';
import { FILTER_DATA, REPORT_STATUS_DATA } from 'app/shared/constants/filter';

export const ReportList = (props: NativeStackScreenProps<ReportStackParamList, 'ReportList'>) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [content, setContent] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: reports, isError, refetch, isFetching, error } = useGetReportsQuery();
  useEffect(() => {
    if (isError) {
      Toast.show(getErrorMessage(error), {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: theme.colors.error
      });
    }
  }, [isError, error]);

  const filterdReports = useMemo(() => {
    if (!reports) return [];
    let result = reports;
    // Filter by orderId
    if (content) {
      result = result.filter((order) => order.content.includes(content));
    }
    // Filter by status
    if (status) {
      result = result.filter((order) => order.status === status);
    }
    // Filter by time range if filterType is 'TIME'
    if (filterType === 'TIME' && startDate && endDate) {
      result = result.filter((report) => {
        return (
          moment(startDate).isSameOrBefore(moment.unix(Number(report.reportedAt)), 'day') &&
          moment(endDate).isSameOrAfter(moment.unix(Number(report.repliedAt)), 'day')
        );
      });
    }

    return result;
  }, [reports, content, status, filterType, startDate, endDate]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderWithSearchAndFilter
        filterList={FILTER_DATA}
        statusList={REPORT_STATUS_DATA}
        title='Danh sách khiếu nại'
        searchString={content}
        setSearchString={setContent}
        {...{
          status,
          setStatus,
          filterType,
          setFilterType,
          startDate,
          setStartDate,
          endDate,
          setEndDate
        }}
      />
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{
          padding: 24,
          gap: 16
        }}
        showsVerticalScrollIndicator={false}
        data={filterdReports}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={globalStyles.title}>Kết quả tìm được</Text>
            <Text style={globalStyles.text}>{`${reports?.length ?? 0} khiếu nại`}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReportItem
            report={item}
            onPress={() => {
              props.navigation.navigate('ReportDetail', { report: item });
            }}
          />
        )}
        ListEmptyComponent={
          <View
            style={{
              zIndex: -1,
              opacity: 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>
              Không có khiếu nại nào! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </Text>
          </View>
        }
      />
      <FAB
        onPress={() => {
          props.navigation.navigate('CreateReport');
        }}
        style={{
          position: 'absolute',
          bottom: 120,
          right: 16,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 50
        }}
        icon='plus'
      />
    </View>
  );
};
