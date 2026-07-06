import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
// import AuthSocial from '../components/authentication/AuthSocial';

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

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Login | niikah">
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
              Masuk ke niikah.id
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {/* Input email dan kata sandi, atau pakai akun dari platform lain. */}
              Input email dan kata sandi
            </Typography>
          </Stack>
          {/* <AuthSocial /> */}

          <LoginForm />

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
