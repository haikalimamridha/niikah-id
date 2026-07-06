import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Link, Container, Typography, Stepper, Step, StepLabel } from '@mui/material';
import useWizardState from 'src/store/wizard.state';

// components
import Page from 'src/components/Page';
import { MHidden } from 'src/components/@material-extend';

// step component
import BrideForm from './step/BrideForm';
import EventForm from './step/EventForm';
// import MultimediaForm from './step/MultimediaForm';
import WebsiteForm from './step/WebsiteForm';
import RegisterForm from './step/RegisterForm';
import Submit from './step/Submit';

// ----------------------------------------------------------------------
const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));
// ----------------------------------------------------------------------
export default function RegisterWizard() {
  const { wizard } = useWizardState();

  return (
    <Page title="Daftar Akun Baru | niikaa.id">
      <Container>
        <ContentStyle>
          <Box sx={{ width: '100%', pt: 3 }}>
            <Stepper activeStep={wizard.activeStep}>
              {wizard.steps.map((label, i) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {wizard.activeStep === 0 && <BrideForm />}
            {wizard.activeStep === 1 && <EventForm />}
            {/* {wizard.activeStep === 2 && <MultimediaForm />} */}
            {wizard.activeStep === 2 && <WebsiteForm />}
            {wizard.activeStep === 3 && <RegisterForm />}
            {wizard.activeStep === 4 && <Submit />}
          </Box>
          <MHidden width="mdUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              Sudah punya akun?&nbsp;
              <Link to="/login" component={RouterLink}>
                Login
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </Page>
  );
}
