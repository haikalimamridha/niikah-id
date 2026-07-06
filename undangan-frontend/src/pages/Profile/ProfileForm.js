import React from 'react';
import { LoadingButton } from '@mui/lab';
import { Form, FormikProvider, useFormik } from 'formik';
import { Stack, Typography, TextField } from '@mui/material';
import { profileSchema } from 'src/schemas/user.schema';
import isMobilePhone from 'validator/lib/isMobilePhone';
import useAuthState from 'src/store/auth.state';
import { updateUser } from 'src/services/user.service';

export default function ProfileForm() {
  const user = useAuthState((state) => state.user);
  const formik = useFormik({
    initialValues: {
      name: user.name || '',
      phone: user.phone || '',
    },
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (values.phone && !isMobilePhone(values.phone, 'id-ID')) {
          formik.setFieldError('phone', 'Format no. telp tidak valid');
          return;
        }
        await updateUser(values);
      } catch (error) {
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, dirty } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <Typography variant="h5" gutterBottom>
          Ubah Profile
        </Typography>
        <Stack spacing={2} mt={4}>
          <TextField
            fullWidth
            label="Nama Lengkap"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            fullWidth
            label="No Telp"
            {...getFieldProps('phone')}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />
        </Stack>
        <Stack mt={3} direction="row" justifyContent="flex-end">
          <LoadingButton type="submit" variant="contained" disabled={isSubmitting || !dirty} loading={isSubmitting}>
            Perbaharui Profile
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
