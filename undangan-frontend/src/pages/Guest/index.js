import { useState } from 'react';
import { Container, Stack, Typography, Button, Portal } from '@mui/material';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
// components
import Page from 'src/components/Page';
import GuestTable from './table';
import MutationModal from './MutationModal';
import MoreMenu from './MoreMenu';
import UploadCsvModal from './UploadCsvModal';
import useAppState from 'src/store/app.state';
import SelectInvitation from 'src/components/SelectInvitation';
import TemplateBroadcastModal from './TemplateBroadcastModal';

export default function Guest() {
  const userInvitation = useAppState((state) => state.userInvitation);
  const [invitationId, setInvitationId] = useState(userInvitation[0]?.id || '');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isCsvModal, setIsCsvModal] = useState(false);
  const [isTemplateModal, setIsTemplateModal] = useState(false);

  const openEditPopUp = (guestId) => {
    setIsOpen(true);
    setEditId(guestId);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setEditId(null);
  };

  return (
    <Page title="Daftar Tamu | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Daftar Tamu Undangan
          </Typography>
          <Stack direction="row">
            <Button variant="contained" onClick={() => setIsOpen(true)} startIcon={<Icon icon={plusFill} />}>
              Tambah Tamu
            </Button>
            {invitationId && (
              <MoreMenu
                invitationId={invitationId}
                openCsvModal={() => setIsCsvModal(true)}
                onBroadcastTemplate={() => setIsTemplateModal(true)}
              />
            )}
          </Stack>
        </Stack>
        <Stack alignItems="flex-end" mb={5}>
          <SelectInvitation value={invitationId} onChange={setInvitationId} />
        </Stack>
        <GuestTable invitationId={invitationId} onEdit={openEditPopUp} />
      </Container>
      <Portal>
        <MutationModal invitationId={invitationId} editId={editId} isOpen={isOpen} onClose={handleCloseModal} />
        <UploadCsvModal invitationId={invitationId} isOpen={isCsvModal} onClose={() => setIsCsvModal(false)} />
        <TemplateBroadcastModal
          invitationId={invitationId}
          isOpen={isTemplateModal}
          onClose={() => setIsTemplateModal(false)}
        />
      </Portal>
    </Page>
  );
}
