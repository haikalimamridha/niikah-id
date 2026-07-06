import { Stack, Typography } from '@mui/material';

export default function RecaptchaTerms() {
  return (
    <Stack mt={2}>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        This site is protected by reCAPTCHA and the Google
      </Typography>
      <Typography sx={{ textAlign: 'center' }} variant="body2">
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and{' '}
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </Typography>
    </Stack>
  );
}
