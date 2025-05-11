import * as yup from 'yup';

export const UpdateDeliverStatusSchema = yup.object({
  id: yup.string().required(),
  status: yup.string().required(),
  canceledImage: yup.string().optional(),
  reason: yup.string().optional()
});

export type UpdateDeliverStatusSchemaType = yup.InferType<typeof UpdateDeliverStatusSchema>;
