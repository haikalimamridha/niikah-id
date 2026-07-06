import { useState } from 'react';
import Api from 'src/utils/Api';
import { Icon } from '@iconify/react';
import { useQuery } from 'react-query';
import InvitationDetails from './InvitationDetails';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Container, Stack, Typography, Button, Portal } from '@mui/material';
// components
import Page from 'src/components/Page';
import MutationModal from './MutationModal';

export default function Invitation() {
  const { data: remoteInvitation, isSuccess } = useQuery('userInvitations', () =>
    Api().get('/v1/invitations?order_by=desc&sort_by=id')
  );
  const [toggleModal, setToggleModal] = useState(false);

  return (
    <Page title="List Undangan | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={6}>
          <Typography variant="h4" gutterBottom>
            List Undangan
          </Typography>
          <Button variant="contained" startIcon={<Icon icon={plusFill} />} onClick={() => setToggleModal(true)}>
            Tambah Undangan
          </Button>
        </Stack>
        {isSuccess &&
          remoteInvitation?.data?.items?.map((invitation, i) => <InvitationDetails key={i} data={invitation} />)}
      </Container>
      <Portal>
        <MutationModal isOpen={toggleModal} onClose={() => setToggleModal(false)} />
      </Portal>
    </Page>
  );
}
