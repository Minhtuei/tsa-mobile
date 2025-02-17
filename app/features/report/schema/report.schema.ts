import * as yup from 'yup';
export const createReportSchema = yup.object().shape({
  content: yup.string().required('Nội dung không được để trống'),
  proof: yup.string().required('Minh chứng không được để trống'),
  orderId: yup.string().required('Mã đơn hàng không được để trống'),
  studentId: yup.string().required('Mã sinh viên không được để trống'),
  reportedAt: yup.string().required('Thời gian không được để trống'),
  repliedAt: yup.string().nullable(),
  reply: yup.string().nullable()
});

export type CreateReportSchemaType = yup.InferType<typeof createReportSchema>;
