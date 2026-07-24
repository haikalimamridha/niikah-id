import { useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from 'src/components/Page';
import InvoiceTable from './table';
import useFeedbackState from 'src/store/feedback.state';
import { createMidtransTransaction } from 'src/services/invoice.service';

export default function Guest() {
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);
  const feedBack = useFeedbackState.getState();

  const onPayNow = async (item) => {
    setPayingInvoiceId(item.id);
    try {
      const payment = await createMidtransTransaction(item.id);
      if (!payment?.redirect_url) {
        feedBack.openErrorFeedback('Gagal menyiapkan pembayaran');
        return;
      }
      window.location.assign(payment.redirect_url);
    } finally {
      setPayingInvoiceId(null);
    }
  };

  return (
    <Page title="Tagihan | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Daftar Tagihan
          </Typography>
        </Stack>
        <InvoiceTable onPayNow={onPayNow} payingInvoiceId={payingInvoiceId} />
      </Container>
    </Page>
  );
}
