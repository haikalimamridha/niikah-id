import { useState, memo } from 'react';
import { useQueryClient } from 'react-query';
import { Box, Button, Typography, Modal, Stack, Link, Alert, AlertTitle } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { onSelectCsv } from 'src/utils/helpers';
import LoadingButton from '@mui/lab/LoadingButton';
import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';

const UploadCsvModal = ({ isOpen, onClose, invitationId }) => {
  const queryClient = useQueryClient();
  const feedBack = useFeedbackState();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTotal, setSuccessTotal] = useState(null);

  const handleClose = () => {
    setFile(null);
    setSuccessTotal(null);
    onClose();
  };

  const submitCsv = async () => {
    try {
      setIsLoading(true);
      const body = new FormData();
      body.append('csv', file);

      const response = await Api().post(`/invitations/${invitationId}/guests/excel`, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessTotal(response.data.total);
      setIsSuccess(true);
      await queryClient.invalidateQueries(['guests', invitationId]);
    } catch (error) {
      feedBack.openErrorFeedback('Gagal upload file, silahkan coba lagi');
      setFile(null);
      setSuccessTotal(null);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
          Upload Tamu undangan dengan CSV
        </Typography>
        <Typography id="modal-modal-description" variant="subtitle1">
          Kamu dapat menambahkan tamu dengan mudah melalui file CSV.
        </Typography>
        <Stack spacing={1} mt={4}>
          <Typography variant="body2">
            1. Langkah pertama silahkan download contoh & format file CSV
            <Link onClick={() => window.open('https://api.niikah.id/examples/guest-template.csv', '_blank')}>
              {' '}
              disini
            </Link>
            {' .'}
          </Typography>
          <Typography variant="body2">
            2. Isi file CSV dengan nama - nama tamu yang akan diundang, bisa dilakukan menggunakan dengan Ms.Excel,
            Libre, Spreadsheet dll.
          </Typography>
          <Typography variant="body2">3. Setelah selesai, pastikan untuk menyimpan file dalam format CSV.</Typography>
          <Typography variant="body2">4. Lakukan upload melalui tombol dibawah</Typography>
        </Stack>
        <Box mt={3}>
          {isSuccess ? (
            <Alert severity="success">
              <AlertTitle>Sukses menambahkan tamu</AlertTitle>
              {successTotal} Tamu berhasil ditambahkan
            </Alert>
          ) : (
            <>
              <input
                type="file"
                accept="text/csv"
                multiple={false}
                onChange={(e) => onSelectCsv(e, setFile)}
                disabled={isLoading}
              />
              {isLoading && <LinearProgress />}
            </>
          )}
        </Box>
        <Box sx={{ float: 'right', mt: 4 }}>
          {!isSuccess && (
            <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleClose}>
              Batal
            </Button>
          )}
          <LoadingButton
            variant="contained"
            autoFocus
            loading={isLoading}
            disabled={isLoading || !file || !invitationId}
            onClick={isSuccess ? handleClose : submitCsv}
          >
            {isSuccess ? 'Tutup' : 'Kirim File'}
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default memo(UploadCsvModal);
