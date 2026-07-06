import { useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import CommentTable from './table';
import MoreMenu from './MoreMenu';
import useAppState from 'src/store/app.state';
import SelectInvitation from 'src/components/SelectInvitation';

export default function Guest() {
  const userInvitation = useAppState((state) => state.userInvitation);
  const [invitationId, setInvitationId] = useState(userInvitation[0]?.id || '');

  return (
    <Page title="Daftar Tamu | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Daftar Kartu Ucapan Masuk
          </Typography>
          <Stack direction="row" alignItems="center">
            <SelectInvitation value={invitationId} onChange={setInvitationId} />
            {invitationId && <MoreMenu invitationId={invitationId} />}
          </Stack>
        </Stack>
        <CommentTable invitationId={invitationId} />
      </Container>
    </Page>
  );
}
