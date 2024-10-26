import * as yup from 'yup';
export const createOrderSchema = yup.object({
  checkCode: yup.string().required('Mã kiểm tra không được để trống'),
  product: yup.string().required('Sản phẩm không được để trống'),
  deliveryDate: yup.string().required('Ngày giao hàng không được để trống'),
  weight: yup.number().required('Khối lượng không được để trống'),
  room: yup.string().required('Phòng không được để trống'),
  building: yup.string().required('Tòa nhà không được để trống'),
  dormitory: yup.string().required('Ký túc xá không được để trống'),
  paymentMethod: yup.string().required('Phương thức thanh toán không được để trống')
});
export type CreateOrderSchemaType = yup.InferType<typeof createOrderSchema>;