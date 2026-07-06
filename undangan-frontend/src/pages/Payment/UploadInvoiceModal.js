import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography, Modal, Stack } from '@mui/material';
import ImagePreview from 'src/components/ImagePreview';
import { onSelectImage } from 'src/utils/helpers';
import { uploadReceipt } from 'src/services/invoice.service';

const UploadInvoiceModal = ({ isOpen, onClose, invitationId }) => {
  const [receiptFile, setReceiptFile] = useState();
  const [loading, setLoading] = useState(false);

  const close = () => {
    setReceiptFile(null);
    onClose();
  };

  const onUploadReceipt = async () => {
    setLoading(true);
    await uploadReceipt(invitationId, receiptFile);
    setLoading(false);
    close();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
          Upload Bukti Pembayaran
        </Typography>
        {/* <Typography id="modal-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
        <Stack spacing={3} mt={1}>
          <ImagePreview sx={{ width: '50%' }} loading="lazy" src={receiptFile && URL.createObjectURL(receiptFile)} />
          <input name="photo_main " accept="image/*" type="file" onChange={(e) => onSelectImage(e, setReceiptFile)} />
        </Stack>
        <Box sx={{ float: 'right', mt: 4 }}>
          <Button variant="contained" onClick={close} color="error" sx={{ mr: 2 }}>
            Batal
          </Button>
          <LoadingButton variant="contained" autoFocus onClick={onUploadReceipt} loading={loading}>
            Simpan
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadInvoiceModal;
