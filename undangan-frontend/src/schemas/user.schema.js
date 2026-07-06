import * as Yup from 'yup';

export const profileSchema = Yup.object().shape({
  name: Yup.string().required('Nama wajib diisi'),
  phone: Yup.string(),
});

export const updatePasswordSchema = Yup.object().shape({
  current_password: Yup.string().required('Kata Sandi lama wajib diisi'),
  new_password: Yup.string()
    .required('Kata Sandi baru wajib diisi')
    .min(5, 'Password baru harus lebih dari 5 karakter'),
  re_new_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Kata sandi baru tidak cocok')
    .required('Ulangi Kata Sandi baru wajib diisi'),
});
