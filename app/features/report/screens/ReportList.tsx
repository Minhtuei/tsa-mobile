import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HeaderWithSearchAndFilter } from 'app/shared/components/HeaderWithSearchAndFilter';
import { FILTER_REPORT_DATA, REPORT_STATUS_DATA } from 'app/shared/constants/filter';
import { useAppTheme, useGlobalStyles } from 'app/shared/hooks/theme';
import { ReportStackParamList } from 'app/shared/types/navigation';
import { ReportType } from 'app/shared/types/report';
import { getErrorMessage } from 'app/shared/utils/helper';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import Toast from 'react-native-root-toast';
import { useGetReportsQuery } from '../api/report.api';
import { ReportItem } from '../components/ReportItem';

export const ReportList = (props: NativeStackScreenProps<ReportStackParamList, 'ReportList'>) => {
  const theme = useAppTheme();
  const globalStyles = useGlobalStyles();

  const [content, setContent] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>('ALL');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState<number>(1);
  const [reports, setReports] = useState<ReportType[]>([]);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const { data, isError, refetch, isFetching, error } = useGetReportsQuery({
    startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
    endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
    status: status ?? undefined,
    sortBy: 'reportedAt',
    sortOrder: 'desc',
    page: page
  });

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

  useEffect(() => {
    if (startDate || endDate || status) {
      setReports([]);
      setPage(1);
      setIsLoadMore(false);
    }
  }, [startDate, endDate, status]);

  useEffect(() => {
    if (data && data.results.length > 0) {
      if (isLoadMore) {
        setReports((prev) => {
          const existingIds = new Set(prev.map((report) => report.id));
          const newReports = data.results.filter((report) => !existingIds.has(report.id));
          return [...prev, ...newReports];
        });
      } else {
        setReports(data.results);
        setPage(1);
      }
    } else {
      setReports([]);
      setPage(1);
    }
  }, [data, isLoadMore]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderWithSearchAndFilter
        filterList={FILTER_REPORT_DATA}
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
          setEndDate,
          isPaid: null,
          setIsPaid: () => {},
          paymentList: [],
          canSearch: false
        }}
      />
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        contentContainerStyle={{
          padding: 24,
          gap: 16
        }}
        showsVerticalScrollIndicator={false}
        data={reports}
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
            <Text style={globalStyles.text}>{`${data?.totalElements ?? 0} khiếu nại`}</Text>
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
        onEndReached={() => {
          // Đảm bảo là đang không load data và còn trang tiếp theo
          if (data?.totalPages && page >= data.totalPages) return; // tránh load thêm khi đã hết trang

          setIsLoadMore(true); // Bắt đầu loading
          setPage((prev) => prev + 1); // Tiến đến trang tiếp theo
        }}
        ListFooterComponent={
          !isFetching && page === data?.totalPages ? (
            <Text style={[globalStyles.title, { textAlign: 'center' }]}>Đã hết khiếu nại</Text>
          ) : null
        }
      />
      {/* <FAB
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
      /> */}
    </View>
  );
};
