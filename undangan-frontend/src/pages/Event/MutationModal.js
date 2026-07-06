import Api from 'src/utils/Api';
import isEmpty from 'lodash-es/isEmpty';
import { useEffect, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { FormikProvider, Form, useFormik } from 'formik';
import { Box, Button, Typography, Modal, Stack, TextField } from '@mui/material';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import TimePicker from '@mui/lab/TimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import { eventSchema, EVENT_INITIAL_END_TIME, EVENT_INITIAL_START_TIME } from 'src/schemas/event.schema';
import MapLocationPreview from 'src/components/MapLocationPreview';

const addEvent = ({ invitationId, values }) => {
  return Api().post(`/invitations/${invitationId}/subevents`, values);
};

const editEvent = ({ invitationId, values, id }) => {
  return Api().patch(`/invitations/${invitationId}/subevents/${id}`, values);
};

const MutationModal = ({ isOpen, onClose, invitationId, editId }) => {
  const queryClient = useQueryClient();
  const [editData, setEditData] = useState({});
  const mutation = useMutation(addEvent, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['events', invitationId]);
      onClose();
    },
  });
  const editMutation = useMutation(editEvent, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['events', invitationId]);
      onClose();
    },
  });
  const formik = useFormik({
    initialValues: {
      name: editData?.name || '',
      location_name: editData?.location_name || '',
      location_address: editData?.location_address || '',
      time_start: editData?.time_start || EVENT_INITIAL_START_TIME,
      time_end: editData?.time_end || EVENT_INITIAL_END_TIME,
      location_coordinate: editData?.location_coordinate || '',
    },
    validationSchema: eventSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (!isEmpty(editData) && editId) {
          // enter edit statement
          await editMutation.mutateAsync({ invitationId, values, id: editId });
        } else {
          await mutation.mutateAsync({ invitationId, values });
        }
        resetForm();
      } catch (error) {
        setSubmitting(false);
      }
    },
  });

  const { handleSubmit, touched, errors, getFieldProps, handleReset, submitForm, isSubmitting, setFieldValue, values } =
    formik;

  const getEvent = useCallback(async () => {
    try {
      const { data } = await Api().get(`/invitations/${invitationId}/subevents/${editId}`);
      setEditData(data.item);
    } catch (error) {
      setEditData({});
    }
  }, [editId, invitationId]);

  useEffect(() => {
    if (editId) {
      getEvent();
    } else {
      setEditData({});
    }
  }, [editId, getEvent]);

  const renderMap = () => {
    if (!errors.location_coordinate && values.location_coordinate) {
      const [lat, long] = values.location_coordinate.split(',');
      return (
        <Box mt={2}>
          <MapLocationPreview title="event-map" height="220" lat={lat} long={long} />
        </Box>
      );
    }
  };

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
              {editId ? 'Ubah Acara' : 'Tambah Acara'}
            </Typography>

            <Stack spacing={3} mt={4}>
              <TextField
                fullWidth
                label="Nama Acara"
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <TextField
                fullWidth
                label="Nama Tempat / Gedung"
                {...getFieldProps('location_name')}
                error={Boolean(touched.location_name && errors.location_name)}
                helperText={touched.location_name && errors.location_name}
              />
              <Stack direction="row" spacing={3}>
                <MobileDatePicker
                  label="Tanggal Acara"
                  inputFormat="dd/MM/yyyy"
                  minDate={EVENT_INITIAL_START_TIME}
                  value={values.time_start}
                  onChange={(time) => {
                    setFieldValue('time_start', time);
                    setFieldValue('time_end', time);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={Boolean(errors.time_start)}
                      helperText={errors.time_start}
                    />
                  )}
                />
                <TimePicker
                  label="Waktu Mulai"
                  ampm={false}
                  value={values.time_start}
                  onChange={(time) => {
                    setFieldValue('time_start', time);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={Boolean(errors.time_start)}
                      helperText={errors.time_start}
                    />
                  )}
                />
                <TimePicker
                  label="Waktu Selesai"
                  ampm={false}
                  value={values.time_end}
                  onChange={(time) => {
                    setFieldValue('time_end', time);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={Boolean(errors.time_end)} helperText={errors.time_end} />
                  )}
                />
              </Stack>
              <TextField
                fullWidth
                label="Koordinat Lokasi"
                placeholder="Contoh : -7.3361935,112.7128087"
                {...getFieldProps('location_coordinate')}
                error={Boolean(touched.location_coordinate && errors.location_coordinate)}
                helperText={touched.location_coordinate && errors.location_coordinate}
              />
              <TextField
                fullWidth
                label="Alamat Lengkap"
                multiline
                minRows={3}
                maxRows={3}
                {...getFieldProps('location_address')}
                error={Boolean(touched.location_address && errors.location_address)}
                helperText={touched.location_address && errors.location_address}
              />
            </Stack>
            {renderMap()}
            <Box sx={{ float: 'right', mt: 3 }}>
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
