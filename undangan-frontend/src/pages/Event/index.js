import { useState } from 'react';
import { Container, Stack, Typography, Button, Portal } from '@mui/material';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// components
import Page from 'src/components/Page';
import EventTable from './table';
import MutationModal from './MutationModal';
import useAppState from 'src/store/app.state';
import SelectInvitation from 'src/components/SelectInvitation';

export default function Event() {
  const userInvitation = useAppState((state) => state.userInvitation);
  const [invitationId, setInvitationId] = useState(userInvitation[0]?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const openEditPopUp = (itemId) => {
    setIsOpen(true);
    setEditId(itemId);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditId(null);
  };

  return (
    <>
      <Page title="Daftar Acara | niikah.id">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h4" gutterBottom>
              Daftar Acara
            </Typography>
            <Stack direction="row">
              <Button variant="contained" onClick={() => setIsOpen(true)} startIcon={<Icon icon={plusFill} />}>
                Tambah Daftar Acara
              </Button>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" mb={5}>
            <SelectInvitation value={invitationId} onChange={setInvitationId} />
          </Stack>
          <EventTable invitationId={invitationId} onEdit={openEditPopUp} />
        </Container>
      </Page>
      <Portal>
        <MutationModal invitationId={invitationId} editId={editId} isOpen={isOpen} onClose={handleCloseModal} />
      </Portal>
    </>
  );
}
