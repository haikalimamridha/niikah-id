import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { Stack, Typography } from '@mui/material';
import { updatePasswordSchema } from 'src/schemas/user.schema';
import PasswordInput from 'src/components/PasswordInput';
import { updatePassword } from 'src/services/user.service';

export default function PasswordForm() {
  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      re_new_password: '',
    },
    validationSchema: updatePasswordSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await updatePassword(values);
      } catch (error) {
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, dirty } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Ubah Password
        </Typography>
        <Stack spacing={2} mt={4}>
          <PasswordInput
            fullWidth
            label="Kata Sandi Lama"
            {...getFieldProps('current_password')}
            error={Boolean(touched.current_password && errors.current_password)}
            helperText={touched.current_password && errors.current_password}
          />
          <PasswordInput
            fullWidth
            label="Kata Sandi Baru"
            {...getFieldProps('new_password')}
            error={Boolean(touched.new_password && errors.new_password)}
            helperText={touched.new_password && errors.new_password}
          />
          <PasswordInput
            fullWidth
            label="Ulangi Kata Sandi Baru"
            {...getFieldProps('re_new_password')}
            error={Boolean(touched.re_new_password && errors.re_new_password)}
            helperText={touched.re_new_password && errors.re_new_password}
          />
        </Stack>
        <Stack mt={3} direction="row" justifyContent="flex-end">
          <LoadingButton type="submit" variant="contained" disabled={isSubmitting || !dirty} loading={isSubmitting}>
            Ubah Kata Sandi
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
