import { apiService } from '@services/api.service';
import { CreateReportSchemaType } from 'app/features/report/schema/report.schema';
import { ReportQueryDto, ReportType, UploadedImage } from 'app/shared/types/report';

const reportApi = apiService.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getReports: build.query<
      {
        totalPages: number;
        totalElements: number;
        results: ReportType[];
      },
      Partial<ReportQueryDto>
    >({
      query: (params) => {
        const query = new URLSearchParams();

        if (params?.page !== undefined) query.append('page', String(params.page));
        if (params?.size !== undefined) query.append('size', String(params.size));
        if (params?.status) query.append('status', params.status);
        if (params?.sortBy) query.append('sortBy', params.sortBy);
        if (params?.sortOrder) query.append('sortOrder', params.sortOrder);
        if (params?.startDate) query.append('startDate', params.startDate);
        if (params?.endDate) query.append('endDate', params.endDate);

        return `reports?${query.toString()}`;
      },
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
} = reportApi;
