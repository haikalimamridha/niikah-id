import * as Yup from 'yup';
import { useState } from 'react';
import Api from 'src/utils/Api';
import { Icon } from '@iconify/react';
import Page from 'src/components/Page';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import AuthLayout from 'src/layouts/AuthLayout';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import useFeedbackState from 'src/store/feedback.state';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useFormik, FormikProvider, Form } from 'formik';
import { MHidden } from 'src/components/@material-extend';
import { Card, Stack, Link, Container, Typography, TextField, IconButton, InputAdornment } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const forgotSchema = Yup.object().shape({
  password: Yup.string().min(5, 'Minimal 5 Karakter').required('Password baru wajib diisi'),
  re_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Password tidak cocok')
    .required(),
});

export default function Login() {
  const params = useParams();
  const navigate = useNavigate();
  const feedback = useFeedbackState();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: '',
      re_password: '',
    },
    validationSchema: forgotSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        Object.assign(values, params);
        await Api().post('/auth/reset-password', values);
        feedback.openSuccessFeedback(`Sukses mengganti password, silahkan login kembali`);
        setSubmitting(false);
        navigate('/', { replace: true });
      } catch {
        setSubmitting(false);
      }
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps, submitForm } = formik;

  return (
    <RootStyle title="Login | Minimal-UI">
      <AuthLayout>
        Belum punya akun?&nbsp;
        <Link underline="none" variant="subtitle2" color="error" component={RouterLink} to="/auth/register">
          Daftar
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Buat undangan niikah-mu bersama kami!
          </Typography>
          <img src="/static/illustrations/illustration_login.svg" alt="login" style={{ margin: 60 }} />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Setel Ulang Kata Sandi
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Masukkan kata sandi baru</Typography>
          </Stack>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3} mb={4}>
                <TextField
                  fullWidth
                  label="Password Baru"
                  type={showPassword ? 'text' : 'password'}
                  {...getFieldProps('password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  fullWidth
                  label="Konfirmasi Password Baru"
                  type={showRepassword ? 'text' : 'password'}
                  {...getFieldProps('re_password')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowRepassword(!showRepassword)} edge="end">
                          <Icon icon={showRepassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.re_password && errors.re_password)}
                  helperText={touched.re_password && errors.re_password}
                />
              </Stack>
            </Form>
          </FormikProvider>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="error"
            onClick={submitForm}
            loading={isSubmitting}
          >
            Kirim
          </LoadingButton>
          <MHidden width="mdUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Belum punya akun?&nbsp;
              <Link variant="subtitle2" color="error" component={RouterLink} to="register">
                Daftar
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
