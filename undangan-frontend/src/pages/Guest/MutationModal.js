import isEmpty from 'lodash-es/isEmpty';
import LoadingButton from '@mui/lab/LoadingButton';
import { guestSchema } from 'src/schemas/guest.schema';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { useEffect, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { FormikProvider, Form, useFormik } from 'formik';
import { Box, Button, Typography, Modal, Stack, TextField } from '@mui/material';
import { addGuest, editGuest, getGuestById } from 'src/services/guest.service';

const MutationModal = ({ isOpen, onClose, invitationId, editId }) => {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const mutation = useMutation(addGuest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['guests', invitationId]);
      onClose();
    },
  });
  const editMutation = useMutation(editGuest, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['guests', invitationId]);
      onClose();
    },
  });
  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      wa_number: editData?.wa_number || '',
      email: editData?.email || '',
      address: editData?.address || '',
    },
    validationSchema: guestSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (values.wa_number && !isMobilePhone(values.wa_number, 'id-ID')) {
          formik.setFieldError('wa_number', 'Format no. telp tidak valid');
          return;
        }
        if (!isEmpty(editData) && editId) {
          // Enter edit scenario
          await editMutation.mutateAsync({ invitationId, values, id: editId });
        } else {
          // enter add scenario
          await mutation.mutateAsync({ invitationId, values });
        }
        resetForm();
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const getGuest = useCallback(async () => {
    try {
      const data = await getGuestById({ invitationId, id: editId });
      setEditData(data.item);
    } catch (error) {
      setEditData({});
    }
  }, [editId, invitationId]);

  useEffect(() => {
    if (editId) {
      getGuest();
    } else {
      setEditData({});
    }
  }, [editId, getGuest]);

  const { handleSubmit, touched, errors, getFieldProps, handleReset, submitForm, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
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
              width: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
              Tambah Tamu Undangan
            </Typography>
            {/* <Typography id="modal-modal-description">
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
            <Stack spacing={3} mt={4}>
              <TextField
                fullwidth
                label="Nama Lengkap Tamu"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  sx={{ mr: 3 }}
                  {...getFieldProps('email')}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  label="No Telp"
                  {...getFieldProps('wa_number')}
                  error={Boolean(touched.wa_number && errors.wa_number)}
                  helperText={touched.wa_number && errors.wa_number}
                />
              </Box>
              <TextField
                fullWidth
                multiline
                label="Kota / Alamat Lengkap"
                minRows={3}
                maxRows={3}
                {...getFieldProps('address')}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
              />
            </Stack>
            <Box sx={{ float: 'right', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                color="error"
                sx={{ mr: 2 }}
              >
                Batal
              </Button>
              <LoadingButton variant="contained" autoFocus onClick={submitForm} loading={isSubmitting}>
                Simpan
              </LoadingButton>
            </Box>
          </Box>
        </Modal>
      </Form>
    </FormikProvider>
  );
};

export default MutationModal;
