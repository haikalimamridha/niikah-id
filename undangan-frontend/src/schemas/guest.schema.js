import * as Yup from 'yup';

export const guestSchema = Yup.object().shape({
  name: Yup.string().required('Nama tamu wajib diisi'),
  wa_number: Yup.string(),
  email: Yup.string().email('Format email tidak valid'),
  address: Yup.string(),
});
