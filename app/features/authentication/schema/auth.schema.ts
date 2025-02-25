import * as Yup from 'yup';
import { emailSchema, passwordPattern } from '../../../shared/schema/common.schema';

export const signInSchema = Yup.object({
  email: emailSchema,
  password: Yup.string().required('Mật khẩu không được để trống')
});

export const signUpSchema = Yup.object({
  email: emailSchema
});

export const verifyEmailSchema = Yup.object({
  token: Yup.string().required('Mã xác thực không được để trống')
});

export const createAccountSchema = Yup.object({
  firstName: Yup.string().required('Tên không được để trống'),
  lastName: Yup.string().required('Họ không được để trống'),
  phoneNumber: Yup.string().required('Số điện thoại không được để trống'),
  dormitory: Yup.string().required('Kí túc xá không được để trống'),
  room: Yup.string().required('Phòng không được để trống'),
  building: Yup.string().required('Tòa nhà không được để trống'),
  password: Yup.string()
    .required('Mật khẩu không được để trống')
    .matches(
      passwordPattern,
      'Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    ),
  confirmPassword: Yup.string()
    .required('Nhập lại mật khẩu không được để trống')
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
  token: Yup.string().required('Mã xác thực không được để trống')
});
export const updateAccountSchema = Yup.object({
  firstName: Yup.string().optional().nonNullable('Tên không được để trống'),
  lastName: Yup.string().optional().nonNullable('Họ không được để trống'),
  phoneNumber: Yup.string().optional().nonNullable('Số điện thoại không được để trống'),
  dormitory: Yup.string().optional().nonNullable('Kí túc xá không được để trống'),
  room: Yup.string().optional().nonNullable('Phòng không được để trống'),
  building: Yup.string().optional().nonNullable('Tòa nhà không được để trống'),
  password: Yup.string()
    .optional()
    .matches(
      passwordPattern,
      'Mật khẩu phải chứa ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
    ),
  confirmPassword: Yup.string()
    .optional()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
  photoUrl: Yup.string().optional().nonNullable()
});
export type SignInSchemaType = Yup.InferType<typeof signInSchema>;
export type SignUpSchemaType = Yup.InferType<typeof signUpSchema>;
export type VerifyEmailSchemaType = Yup.InferType<typeof verifyEmailSchema>;
export type CreateAccountSchemaType = Yup.InferType<typeof createAccountSchema>;
export type UpdateAccountSchemaType = Yup.InferType<typeof updateAccountSchema>;
