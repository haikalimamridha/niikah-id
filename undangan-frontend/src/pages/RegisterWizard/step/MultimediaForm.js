import * as Yup from 'yup';
import { Typography, Stack, TextField, Grid } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import ImagePreview from 'src/components/ImagePreview';
import StepFormWraper from './StepFormWraper';
import StepNavigator from './StepNavigator';
import useWizardState from 'src/store/wizard.state';
import { onSelectImage, onSelectSong } from 'src/utils/helpers';
import { useState } from 'react';

const multimediaSchema = Yup.object().shape({
  url_youtube: Yup.string().url(),
});

export default function MultimediaForm() {
  const { nextForm, prevForm, setMultimediaForm, ...wizardState } = useWizardState();
  const [mainPhoto, setMainPhoto] = useState(wizardState.photo_main || null);
  const [bgMusic, setBgMusic] = useState(wizardState.bg_music || null);

  const formik = useFormik({
    initialValues: {
      url_youtube: wizardState.url_youtube,
    },
    validationSchema: multimediaSchema,
    onSubmit: (values, { setSubmitting }) => {
      setMultimediaForm({ ...values, photo_main: mainPhoto, bg_music: bgMusic });
      setSubmitting(false);
      nextForm();
    },
  });

  const { handleSubmit, touched, errors, getFieldProps, submitForm, isValid } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <StepFormWraper>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10}>
              <Grid container direction="row" spacing={4}>
                <Grid item xs={12} lg={4}>
                  <ImagePreview
                    sx={{ marginBottom: 2 }}
                    src={mainPhoto && URL.createObjectURL(mainPhoto)}
                    loading="lazy"
                  />
                  <Typography variant="h6" gutterBottom>
                    Foto Utama
                  </Typography>
                  <input
                    name="photo_main"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onSelectImage(e, setMainPhoto)}
                  />
                </Grid>
                {/* <Grid item xs={12} lg={4} sx={{ mt: { xs: 2, lg: 0 } }}>
                <ImagePreview />
                <Typography variant="h6" gutterBottom>
                  Foto Pre-wedding
                </Typography>
                <input type="file" accept="image/*" />
              </Grid> */}
                <Grid item xs={12} lg={4} sx={{ mt: { xs: 2, lg: 0 } }} alignSelf="flex-end">
                  <Typography variant="h6" gutterBottom>
                    Lagu Latar Belakang
                  </Typography>
                  <input
                    name="bg_music"
                    type="file"
                    accept="audio/mpeg"
                    onChange={(e) => onSelectSong(e, setBgMusic)}
                  />
                </Grid>
              </Grid>
              <Stack sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label="Link Youtube"
                  {...getFieldProps('url_youtube')}
                  error={Boolean(touched.url_youtube && errors.url_youtube)}
                  helperText={touched.url_youtube && errors.url_youtube}
                />
              </Stack>
            </Grid>
          </Grid>
        </StepFormWraper>
        <StepNavigator onBack={prevForm} onNext={submitForm} disabledNext={!isValid} />
      </Form>
    </FormikProvider>
  );
}
