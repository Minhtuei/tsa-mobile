import { CreateOrderSchemaType } from '@validations/order.schema';
import { apiService } from './api.service';
import { CreateReportSchemaType } from '@validations/report.schema';
import { ReportType, UploadedImage } from 'app/types/report';

const reportService = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getReports: build.query<ReportType[], void>({
      query: () => 'reports',
      providesTags: ['Reports']
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
} = reportService;
