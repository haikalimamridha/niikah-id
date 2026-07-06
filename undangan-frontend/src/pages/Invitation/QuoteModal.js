import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography, Modal, Stack, TextField } from '@mui/material';
import { updateInvitation } from 'src/services/invitation.service';
import { getFormData } from 'src/utils/helpers';

const QuoteModal = ({ isOpen, onClose, item }) => {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(item.content.quote || '');

  const onSubmit = async () => {
    try {
      setLoading(true);
      await updateInvitation(item.id, getFormData({ quote }));
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
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
          width: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
          Quote Undangan
        </Typography>
        {/* <Typography id="modal-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
        <Stack mt={4}>
          <TextField
            fullWidth
            multiline
            placeholder="Tuliskan quote / kata-mutiara untuk undanganmu disini"
            minRows={10}
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </Stack>
        <Box sx={{ float: 'right', mt: 4 }}>
          <Button variant="contained" onClick={onClose} color="error" sx={{ mr: 2 }}>
            Batal
          </Button>
          <LoadingButton variant="contained" autoFocus loading={loading} disabled={loading} onClick={onSubmit}>
            Simpan
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default QuoteModal;
