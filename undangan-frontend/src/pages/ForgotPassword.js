import * as Yup from 'yup';
import Api from 'src/utils/Api';
import Page from 'src/components/Page';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import AuthLayout from 'src/layouts/AuthLayout';
import { Link as RouterLink } from 'react-router-dom';
import useFeedbackState from 'src/store/feedback.state';
import { useFormik, FormikProvider, Form } from 'formik';
import { MHidden } from 'src/components/@material-extend';
import { Card, Stack, Link, Container, Typography, TextField } from '@mui/material';

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
  email: Yup.string().email('Format email tidak valid').required('Email wajib diisi'),
});

export default function Login() {
  const feedback = useFeedbackState();
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await Api().post('/auth/forgot-password', values);
      setSubmitting(false);
      feedback.openSuccessFeedback(
        `Jika email terdaftar di sistem, Email reset password akan dikirim ke ${values.email}`
      );
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
              Lupa Password
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Masukkan email yang terdaftar di niikah.id</Typography>
          </Stack>
          <Stack spacing={3} mb={4}>
            <FormikProvider value={formik}>
              <Form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="Masukkan email yang terdaftar"
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Form>
            </FormikProvider>
          </Stack>
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
