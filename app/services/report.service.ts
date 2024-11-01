import { CreateOrderSchemaType } from '@validations/order.schema';
import { apiService } from './api.service';

const reportService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getReports: build.query<ReportType[], void>({
      query: () => 'reports',
      providesTags: ['Reports']
    }),
    createReport: build.mutation<void, CreateOrderSchemaType>({
      query: (report) => ({
        url: 'reports',
        method: 'POST',
        body: report
      }),
      invalidatesTags: ['Reports']
    })
  })
});
export const { useGetReportsQuery, useCreateReportMutation } = reportService;
