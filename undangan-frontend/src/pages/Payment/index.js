import { useState } from 'react';
import { Container, Stack, Typography, Portal } from '@mui/material';
// components
import Page from 'src/components/Page';
import InvoiceTable from './table';
import UploadInvoiceModal from './UploadInvoiceModal';

export default function Guest() {
  const [invitationId, setInvitationId] = useState(false);

  const toggleModal = (id) => {
    setInvitationId(Boolean(id) ? id : null);
  };

  return (
    <Page title="Tagihan | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Daftar Tagihan
          </Typography>
        </Stack>
        <InvoiceTable onTriggerUploadModal={toggleModal} />
      </Container>
      <Portal>
        <UploadInvoiceModal isOpen={Boolean(invitationId)} invitationId={invitationId} onClose={toggleModal} />
      </Portal>
    </Page>
  );
}
