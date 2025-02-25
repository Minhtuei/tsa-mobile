import * as Yup from 'yup';
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&~*+=%<>.,?;:'"`_()[\]{}|/\\-]).{8,}$/;

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailSchema = Yup.string()
  .required('Email không được để trống')
  .matches(emailPattern, 'Email không hợp lệ');
