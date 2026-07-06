import * as Yup from 'yup';

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Terlalu pendek !').max(50, 'Terlalu panjang').required('Nama Lengkap wajib diisi'),
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: Yup.string().required('Kata Sandi wajib diisi'),
  phone: Yup.string(),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
  password: Yup.string().required('Password wajib diisi'),
});
