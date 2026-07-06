// import { useState, useRef, useEffect } from 'react';
import { useState} from 'react';
// import ReCAPTCHA from 'react-google-recaptcha';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Link, Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LoginSchema } from 'src/schemas/auth.schema';
import { loginUser } from 'src/services/auth.service';
// import config from 'src/constants/config';
// import RecaptchaTerms from 'src/components/RecaptchaTerms';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  // const recaptchaRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  // const [initRecaptcha, setInitRecaptcha] = useState(false);
  // const [recaptchaReady, setRecaptchaReady] = useState(false);

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
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // const recaptcha_token = await recaptchaRef.current.executeAsync();
        // await loginUser({ ...values, recaptcha_token });
        await loginUser({ ...values});
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Alamat email"
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>
          <Link component={RouterLink} variant="subtitle2" color="error" to="/auth/forgot-password">
            Lupa kata sandi?
          </Link>
        </Stack>

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
          color="error"
          loading={isSubmitting}
          // disabled={!recaptchaReady}
        >
          Masuk
        </LoadingButton>

        {/* <RecaptchaTerms /> */}
      </Form>
    </FormikProvider>
  );
}
