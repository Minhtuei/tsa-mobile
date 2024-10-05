import * as Yup from 'yup';
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&~*+=%<>.,?;:'"`_()[\]{}|/\\-]).{8,}$/;

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const signInSchema = Yup.object({
  email: Yup.string()
    .required('Email không được để trống')
    .matches(emailPattern, 'Email không hợp lệ'),
  password: Yup.string().required('Mật khẩu không được để trống'),
});

export const signupSchema = Yup.object({
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
});

export type SignInSchemaType = Yup.InferType<typeof signInSchema>;
export type SignupSchemaType = Yup.InferType<typeof signupSchema>;
