import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Typography, Modal, Stack, TextField } from '@mui/material';

import useAppState from 'src/store/app.state';
import { updateInvitation } from 'src/services/invitation.service';
import { getFormData } from 'src/utils/helpers';

const TemplateBroadcastModal = ({ isOpen, onClose, invitationId }) => {
  const userInvitation = useAppState((state) => state.userInvitation);
  const currentInvitation = userInvitation.find((inv) => inv.id === invitationId);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(currentInvitation?.content?.broadcast_template || '');

  const onSubmit = async () => {
    try {
      setLoading(true);
      await updateInvitation(invitationId, getFormData({ broadcast_template: message }));
      useAppState.getState().getUserInvitation();
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
        <Typography id="modal-modal-title" variant="\" component="h2" gutterBottom>
          Template Broadcast Whatsapp
        </Typography>
        {/* <Typography id="modal-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
        <Stack mt={4}>
          <TextField fullWidth multiline minRows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          <Typography variant="body2" component="p" sx={{ mt: 1 }}>
            Bisa menggunakan variabel __NAMA__ atau __LINK__ untuk template pesan whatsapp
          </Typography>
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

export default TemplateBroadcastModal;
