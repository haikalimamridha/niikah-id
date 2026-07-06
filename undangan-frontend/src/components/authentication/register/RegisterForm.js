// import ReCAPTCHA from 'react-google-recaptcha';
// import { useState, useEffect, useRef } from 'react';
import { useState} from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { RegisterSchema } from 'src/schemas/auth.schema';
import { registerUser } from 'src/services/auth.service';
import { LoadingButton } from '@mui/lab';
// import config from 'src/constants/config';
import RecaptchaTerms from 'src/components/RecaptchaTerms';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  // const recaptchaRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  // const [initRecaptcha, setInitRecaptcha] = useState(false); // tes
  // const [recaptchaReady, setRecaptchaReady] = useState(false); // tes

  // useEffect(() => {
  //   if (!initRecaptcha) {
  //     setTimeout(() => {
  //       setInitRecaptcha(true);
  //     }, 1000);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // const recaptcha_token = await recaptchaRef.current.executeAsync();
        await registerUser({ ...values});
        navigate('/', { replace: true });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Nama Lengkap"
            {...getFieldProps('name')}
            error={Boolean(touched.name && errors.name)}
            helperText={touched.name && errors.name}
          />
          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Alamat Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Kata sandi"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          {/* <Stack mt={2} mb={1}>
            {initRecaptcha && (
              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={config.RECAPTCHA_KEY}
                asyncScriptOnLoad={() => setRecaptchaReady(true)}
              />
            )}
          </Stack> */}

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            // disabled={!recaptchaReady}
          >
            Daftar
          </LoadingButton>
        </Stack>

        <RecaptchaTerms />
      </Form>
    </FormikProvider>
  );
}
