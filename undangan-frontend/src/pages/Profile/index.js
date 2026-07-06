import React from 'react';
import { Container, Grid, Divider } from '@mui/material';
import Page from 'src/components/Page';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import UploadAvatar from './UploadAvatar';

export default function Profile() {
  return (
    <Page title="Profile | niikah.id">
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={12} lg={2}>
            <UploadAvatar />
          </Grid>
          <Grid item xs={12} md={11} lg={9}>
            <ProfileForm />
            <Divider sx={{ mt: 4, mb: 4 }} />
            <PasswordForm />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
