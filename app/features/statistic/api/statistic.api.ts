// services/statistics.service.ts
import { apiService } from '@services/api.service';
import { OrderStatistics } from 'app/state/order.slice';
import { QueryType } from '@components/QueryTypeBtnTab';

const statisticsService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getStatistics: build.query<
      OrderStatistics, // Response type
      { type: QueryType } // Query argument type
    >({
      query: ({ type }) => ({
        url: 'orders/stats',
        params: { type }
      }),
      providesTags: ['Statistics']
    })
  })
});

export const { useGetStatisticsQuery } = statisticsService;
