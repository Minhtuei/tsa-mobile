import { apiService } from '@services/api.service';
import { CreateReportSchemaType } from 'app/features/report/schema/report.schema';
import { ReportType, UploadedImage } from 'app/shared/types/report';

const reportApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getReports: build.query<ReportType[], void>({
      query: () => 'reports',
      providesTags: ['Reports'],
      transformResponse: (response: any) => {
        return response.results.sort((a: ReportType, b: ReportType) => {
          return Number(b.reportedAt) - Number(a.reportedAt);
        });
      }
    }),
    createReport: build.mutation<void, CreateReportSchemaType>({
      query: (report) => ({
        url: 'reports',
        method: 'POST',
        body: report
      }),
      invalidatesTags: ['Reports']
    }),
    upLoadImage: build.mutation<UploadedImage, FormData>({
      query: (formData) => ({
        url: 'cloudinary',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }),
    updateReport: build.mutation<void, { report: CreateReportSchemaType; reportId: string }>({
      query: ({ report, reportId }) => ({
        url: `reports/${reportId}`,
        method: 'PATCH',
        body: report
      }),
      invalidatesTags: ['Reports']
    }),
    deleteReport: build.mutation<void, string>({
      query: (reportId) => ({
        url: `reports/${reportId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Reports']
    })
  })
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useUpLoadImageMutation,
  useUpdateReportMutation,
  useDeleteReportMutation
} = reportApi;
