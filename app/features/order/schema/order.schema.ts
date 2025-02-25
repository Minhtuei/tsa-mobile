import { OrderCancelReason, OrderStatus } from 'app/shared/constants/status';
import * as yup from 'yup';
export const createOrderSchema = yup.object({
  checkCode: yup.string().required('Mã kiểm tra không được để trống'),
  product: yup.string().required('Sản phẩm không được để trống'),
  time: yup.string().required('Thời gian không được để trống'),
  deliveryDate: yup.string().required('Ngày giao hàng không được để trống'),
  weight: yup.string().required('Khối lượng không được để trống'),
  room: yup.string().required('Phòng không được để trống'),
  building: yup.string().required('Tòa nhà không được để trống'),
  dormitory: yup.string().required('Ký túc xá không được để trống'),
  paymentMethod: yup.string().required('Phương thức thanh toán không được để trống'),
  brand: yup.string().required('Sàn thương mại không được để trống'),
  phone: yup.string().required('Số điện thoại không được để trống')
});

// export const finishOrderSchema = yup.object({
//   finishedImage: yup.string().required('Ảnh hoàn thành không được để trống'),
//   distance: yup.number().required('Khoảng cách không được để trống'),
//   status: yup.string().required('Trạng thái không được để trống')
// });

// export const cancelOrderSchema = yup.object({
//   status: yup.string().required('Trạng thái không được để trống'),
//   canceledImage: yup.string().required('Ảnh hủy không được để trống'),
//   cancelReasonType: yup.string().required('Lý do hủy không được để trống'),
//   reason: yup.string().required('Lý do hủy không được để trống')
// });

export const updateOrderStatusSchema = yup.object({
  status: yup.string().required('Trạng thái không được để trống'),
  distance: yup.number().when('status', {
    is: (status: any) => status === OrderStatus.DELIVERED,
    then: (schema) => schema.required('Khoảng cách không được để trống'),
    otherwise: (schema) => schema.optional()
  }),
  finishedImage: yup.string().when('status', {
    is: (status: any) => status === OrderStatus.DELIVERED,
    then: (schema) => schema.required('Ảnh hoàn thành không được để trống'),
    otherwise: (schema) => schema.optional()
  }),
  cancelReasonType: yup.string().optional(),
  canceledImage: yup.string().when(['status', 'cancelReasonType'], (values, schema) => {
    const [status, cancelReasonType] = values;
    if (
      status === OrderStatus.CANCELED &&
      !(cancelReasonType in [OrderCancelReason.OTHER, OrderCancelReason.PERSONAL_REASON])
    ) {
      return schema.required('Ảnh hủy không được để trống');
    }
    return schema.optional();
  }),
  reason: yup.string().when(['status', 'cancelReasonType'], (values, schema) => {
    const [status, cancelReasonType] = values;
    if (status === OrderStatus.CANCELED && cancelReasonType === OrderCancelReason.OTHER) {
      return schema.required('Lý do hủy không được để trống');
    }
    return schema.optional();
  })
});
export type CreateOrderSchemaType = yup.InferType<typeof createOrderSchema>;
export type UpdateOrderStatusSchemaType = yup.InferType<typeof updateOrderStatusSchema>;
