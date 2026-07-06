import * as Yup from 'yup';
import React, { useState } from 'react';
import { Typography, Stack, TextField, Grid } from '@mui/material';
import { useFormik, Form, FormikProvider } from 'formik';
import useWizardState from 'src/store/wizard.state';
import ImagePreview from 'src/components/ImagePreview';
import StepFormWraper from './StepFormWraper';
import StepNavigator from './StepNavigator';
import { onSelectImage } from 'src/utils/helpers';

const brideSchema = Yup.object().shape({
  male_name: Yup.string().required('Nama Pengantin laki-laki wajib diisi'),
  female_name: Yup.string().required('Nama Pengantin perempuan wajib diisi'),
  male_parents: Yup.string().required('Nama wali wajib diisi'),
  female_parents: Yup.string().required('Nama wali wajib diisi'),
  male_nickname: Yup.string().required('Nama Panggilan mempelai laki-laki wajib diisi'),
  female_nickname: Yup.string().required('Nama Panggilan mempelai perempuan wajib diisi'),
});

export default function BrideForm() {
  const { nextForm, setBrideForm, ...wizardState } = useWizardState();
  const [malePhoto, setMalePhoto] = useState(wizardState.photo_male);
  const [femalePhoto, setFemalePhoto] = useState(wizardState.photo_female);

  const formik = useFormik({
    initialValues: {
      male_name: wizardState.male_name,
      female_name: wizardState.female_name,
      male_parents: wizardState.male_parents,
      female_parents: wizardState.female_parents,
      male_nickname: wizardState.male_nickname,
      female_nickname: wizardState.female_nickname,
    },
    validationSchema: brideSchema,
    onSubmit: (values, { setSubmitting }) => {
      setBrideForm({ ...values, photo_male: malePhoto, photo_female: femalePhoto });
      setSubmitting(false);
      nextForm();
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, submitForm, isValid } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <StepFormWraper>
          <Grid container spacing={4} justifyContent="center">
            <Grid container xs={12} md={10} item spacing={4}>
              <Grid item xs={12} sm={6} spacing={3}>
                <Stack spacing={3}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                    Mempelai Pria
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    {...getFieldProps('male_name')}
                    error={Boolean(touched.male_name && errors.male_name)}
                    helperText={touched.male_name && errors.male_name}
                  />
                  <TextField
                    fullWidth
                    label="Nama Panggilan"
                    {...getFieldProps('male_nickname')}
                    error={Boolean(touched.male_nickname && errors.male_nickname)}
                    helperText={touched.male_nickname && errors.male_nickname}
                  />
                  <TextField
                    fullWidth
                    label="Nama Wali"
                    placeholder="Bapak / Ibu ......"
                    {...getFieldProps('male_parents')}
                    error={Boolean(touched.male_parents && errors.male_parents)}
                    helperText={touched.male_parents && errors.male_parents}
                  />
                  <Typography variant="body1"> Photo Mempelai laki-laki</Typography>
                  <ImagePreview loading="lazy" src={malePhoto && URL.createObjectURL(malePhoto)} />
                  <input
                    name="photo_male "
                    accept="image/*"
                    type="file"
                    onChange={(e) => onSelectImage(e, setMalePhoto)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} spacing={3}>
                <Stack spacing={3}>
                  <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                    Mempelai Wanita
                  </Typography>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    {...getFieldProps('female_name')}
                    error={Boolean(touched.female_name && errors.female_name)}
                    helperText={touched.female_name && errors.female_name}
                  />
                  <TextField
                    fullWidth
                    label="Nama Panggilan"
                    {...getFieldProps('female_nickname')}
                    error={Boolean(touched.female_nickname && errors.female_nickname)}
                    helperText={touched.female_nickname && errors.female_nickname}
                  />
                  <TextField
                    fullWidth
                    label="Nama Wali"
                    placeholder="Bapak / Ibu ......"
                    {...getFieldProps('female_parents')}
                    error={Boolean(touched.female_parents && errors.female_parents)}
                    helperText={touched.female_parents && errors.female_parents}
                  />
                  <Typography variant="body1"> Photo Mempelai wanita</Typography>
                  <ImagePreview loading="lazy" src={femalePhoto && URL.createObjectURL(femalePhoto)} />
                  <input
                    name="photo_female"
                    accept="image/*"
                    type="file"
                    onChange={(e) => onSelectImage(e, setFemalePhoto)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </StepFormWraper>
      </Form>
      <StepNavigator disabledBack onNext={submitForm} disabledNext={!isValid} />
    </FormikProvider>
  );
}
