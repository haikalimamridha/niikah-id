import ReCAPTCHA from 'react-google-recaptcha';
import { useState, useEffect, useRef } from 'react';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { Icon } from '@iconify/react';
import { FormikProvider, Form, useFormik } from 'formik';
import { Typography, Stack, TextField, Grid, IconButton, InputAdornment } from '@mui/material';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import StepFormWraper from './StepFormWraper';
import StepNavigator from './StepNavigator';
import useWizardState from 'src/store/wizard.state';
import { RegisterSchema } from 'src/schemas/auth.schema';
import config from 'src/constants/config';
import RecaptchaTerms from 'src/components/RecaptchaTerms';

export default function RegisterForm() {
  const recaptchaRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const { nextForm, prevForm, setAccount, account, registerProcess, registedToken } = useWizardState();
  const [initRecaptcha, setInitRecaptcha] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    if (!initRecaptcha) {
      setTimeout(() => {
        setInitRecaptcha(true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      name: account.name,
      email: account.email,
      password: account.password,
      phone: account.phone,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const recaptcha_token = await recaptchaRef.current.executeAsync();
        if (!registedToken) {
          if (values.phone && !isMobilePhone(values.phone, 'id-ID')) {
            setFieldError('phone', 'Format no. telp tidak valid');
            return;
          }
          setAccount(values);
          await registerProcess(recaptcha_token);
          nextForm();
        } else {
          setSubmitting(false);
          nextForm();
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, submitForm, isValid, setFieldError } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <StepFormWraper>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10}>
              <Typography variant="h5" gutterBottom>
                Daftar Akun
              </Typography>
              <Stack spacing={3} mt={4}>
                <TextField
                  fullWidth
                  label="Nama Lengkap"
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  label="No. Handphone (WA)"
                  {...getFieldProps('phone')}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <TextField
                  fullWidth
                  label="Kata sandi"
                  type={showPassword ? 'text' : 'password'}
                  {...getFieldProps('password')}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              {initRecaptcha && (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="invisible"
                  sitekey={config.RECAPTCHA_KEY}
                  asyncScriptOnLoad={() => setRecaptchaReady(true)}
                />
              )}
              <RecaptchaTerms />
            </Grid>
          </Grid>
        </StepFormWraper>
        <StepNavigator
          onNext={submitForm}
          onBack={prevForm}
          disabledNext={!isValid || !recaptchaReady}
          nextText={registedToken ? 'Selanjutnya' : 'Daftar Sekarang'}
        />
      </Form>
    </FormikProvider>
  );
}
