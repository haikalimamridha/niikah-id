// material
import { Grid, Container, Box, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import useAuthState from 'src/store/auth.state';
// import { AppOrderTimeline } from '../../components/_dashboard/app';
import InvitationStats from './components/InvitationStats';
import CommentStats from './components/CommentStats';
import ViewStats from './components/ViewStats';
import GuestStats from './components/GuestStats';
import LatestComment from './components/LatestComment';
import DailyViewStats from './components/DailyViewStats';
import CityVisits from './components/CityVisits';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const user = useAuthState((state) => state.user);

  return (
    <Page title="Dashboard | niikah.id">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Halo {user.name}, Selamat Datang kembali</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <InvitationStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <GuestStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CommentStats />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ViewStats />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <DailyViewStats />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <CityVisits />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <LatestComment />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
