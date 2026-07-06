import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Stack, Grid, Box, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import StepFormWraper from './StepFormWraper';
import StepNavigator from './StepNavigator';
import useWizardState from 'src/store/wizard.state';

export default function EventForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [disablePrev, setDisablePrev] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { prevForm, invitationCreation, subeventCreation, resetWizard } = useWizardState();

  const submitWizard = async () => {
    try {
      setLoading(true);
      setDisablePrev(true);
      await invitationCreation();
      await subeventCreation();
      setIsSuccess(true);
    } catch (error) {
      setDisablePrev(false);
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigate('/auth/login', true);
    resetWizard();
  };

  return (
    <>
      <StepFormWraper>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10}>
            <Stack spacing={2} alignItems="center">
              <Typography variant="h3" sx={{ textAlign: 'center' }}>
                {isSuccess ? 'Undanganmu sudah siap !' : 'Undanganmu akan segera siap !'}
              </Typography>
              <Typography variant="subtitle2" sx={{ textAlign: 'center', width: '90%' }}>
                {isSuccess
                  ? 'Akun barumu sudah selesai disiapkan silahkan login untuk memulai'
                  : 'Kami sudah membuatkan akun baru untukmu, untuk melanjutkan, Pastikan data-data yang kamu masukan sudahbenar lalu tekan tombol Proses Data untuk mulai mengirim semua data kepada kami'}
              </Typography>
              <Box mt={3}>
                {isSuccess ? (
                  <Button variant="contained" onClick={navigateToLogin}>
                    Pergi ke halaman login
                  </Button>
                ) : (
                  <LoadingButton loading={loading} variant="contained" onClick={submitWizard}>
                    Proses Data
                  </LoadingButton>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </StepFormWraper>
      <StepNavigator disabledNext disabledBack={disablePrev} onBack={prevForm} />
    </>
  );
}
