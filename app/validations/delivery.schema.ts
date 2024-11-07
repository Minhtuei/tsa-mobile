import * as yup from 'yup';

export const createDeliverySchema = yup.object({
  orderIds: yup.array().of(yup.string().required()).required('Order IDs are required'),
  limitTime: yup.number().required('Limit time is required'),
  staffId: yup.string().nullable()
});

export type CreateDeliverySchemaType = yup.InferType<typeof createDeliverySchema>;

export const updateDeliverySchema = createDeliverySchema.partial();

export type UpdateDeliverySchemaType = yup.InferType<typeof updateDeliverySchema>;
