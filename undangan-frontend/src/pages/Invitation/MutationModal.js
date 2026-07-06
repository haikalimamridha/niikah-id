import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useMutation, useQueryClient } from 'react-query';
import { FormikProvider, Form, useFormik } from 'formik';
import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  TextField,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from '@mui/material';
import { fRupiah } from 'src/utils/formatNumber';
import ImagePreview from 'src/components/ImagePreview';
import { invitationSchema } from 'src/schemas/invitation.schema';
import { createInvitation } from 'src/services/invitation.service';
import { getFormData, isSubdomaiAvailable, onSelectImage } from 'src/utils/helpers';
import useAppState from 'src/store/app.state';

const MutationModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const packages = useAppState((state) => state.packages);
  const templates = useAppState((state) => state.templates);
  const [malePhoto, setMalePhoto] = useState();
  const [femalePhoto, setFemalePhoto] = useState();

  const resetPhoto = () => {
    setMalePhoto(null);
    setFemalePhoto(null);
  };

  const mutation = useMutation(createInvitation, {
    onSuccess: async () => {
      // re update invitation caches
      await queryClient.invalidateQueries(['userInvitations']);
      useAppState.getState().getUserInvitation();
      onClose();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      subdomain: '',
      template_name: '',
      male_name: '',
      female_name: '',
      male_parents: '',
      female_parents: '',
      package_id: '',
      male_nickname: '',
      female_nickname: '',
    },
    validationSchema: invitationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const isSubdomainOk = await isSubdomaiAvailable(values.subdomain);
        if (!isSubdomainOk) {
          setFieldError('subdomain', 'subdomain tidak tersedia !');
          return;
        }

        const body = getFormData({
          ...values,
          photo_male: malePhoto,
          photo_female: femalePhoto,
        });

        await mutation.mutateAsync(body);
        resetForm();
        resetPhoto();
      } catch (error) {
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    handleSubmit,
    touched,
    errors,
    getFieldProps,
    handleReset,
    submitForm,
    isSubmitting,
    setFieldError,
    values,
    handleBlur,
    handleChange,
  } = formik;

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
              width: 900,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              overflowY: 'auto',
            }}
          >
            <Typography id="modal-modal-title" variant="h5" component="h2" gutterBottom>
              Tambah Undangan Pernikahan
            </Typography>
            <Divider />
            <Grid container mt={2} spacing={2}>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <TextField
                    fullWidth
                    label="Subdomain"
                    {...getFieldProps('subdomain')}
                    error={Boolean(touched.subdomain && errors.subdomain)}
                    helperText={touched.subdomain && errors.subdomain}
                  />
                  <Typography sx={{ ml: 2 }}>.niikah.id</Typography>
                </Stack>
                <Stack spacing={3} mt={3}>
                  <TextField
                    fullWidth
                    label="Judul Undangan"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack spacing={3}>
                  <FormControl fullWidth error={Boolean(touched.template_name && errors.template_name)}>
                    <InputLabel id="template-select-label">Pilih Template Undangan</InputLabel>
                    <Select
                      name="template_name"
                      labelId="template-select-label"
                      id="template-select"
                      value={values.template_name}
                      label="Pilih Template Undangan"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {templates.map((template, i) => (
                        <MenuItem key={i} value={template.name}>
                          {template.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.template_name && errors.template_name}</FormHelperText>
                  </FormControl>
                  <FormControl fullWidth error={Boolean(touched.package_id && errors.package_id)}>
                    <InputLabel id="package-select-label">Pilih Paket Undangan</InputLabel>
                    <Select
                      name="package_id"
                      labelId="package-select-label"
                      id="package-select"
                      value={values.package_id}
                      label="Pilih Paket Undangan"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      {packages.map((pckg, i) => (
                        <MenuItem key={i} value={pckg.id}>{`${pckg.name} - ${fRupiah(pckg.price)}`}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.package_id && errors.package_id}</FormHelperText>
                  </FormControl>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 3, mt: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ mb: 2.5 }}>
                  Data Mempelai Laki-laki
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    {...getFieldProps('male_name')}
                    error={Boolean(touched.male_name && errors.male_name)}
                    helperText={touched.male_name && errors.male_name}
                  />
                  <TextField
                    fullWidth
                    label="Nama Panggilan"
                    {...getFieldProps('male_nickname')}
                    error={Boolean(touched.male_nickname && errors.male_nickname)}
                    helperText={touched.male_nickname && errors.male_nickname}
                  />
                  <TextField
                    fullWidth
                    label="Nama Wali"
                    placeholder="Bapak / Ibu ......"
                    {...getFieldProps('male_parents')}
                    error={Boolean(touched.male_parents && errors.male_parents)}
                    helperText={touched.male_parents && errors.male_parents}
                  />
                  <Typography variant="body1"> Photo Mempelai laki-laki</Typography>
                  <ImagePreview
                    sx={{ height: '120px' }}
                    loading="lazy"
                    src={malePhoto && URL.createObjectURL(malePhoto)}
                  />
                  <input
                    name="photo_male "
                    accept="image/*"
                    type="file"
                    onChange={(e) => onSelectImage(e, setMalePhoto)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ mb: 2.5 }}>
                  Mempelai Wanita
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Nama Lengkap"
                    {...getFieldProps('female_name')}
                    error={Boolean(touched.female_name && errors.female_name)}
                    helperText={touched.female_name && errors.female_name}
                  />
                  <TextField
                    fullWidth
                    label="Nama Panggilan"
                    {...getFieldProps('female_nickname')}
                    error={Boolean(touched.female_nickname && errors.female_nickname)}
                    helperText={touched.female_nickname && errors.female_nickname}
                  />
                  <TextField
                    fullWidth
                    label="Nama Wali"
                    placeholder="Bapak / Ibu ......"
                    {...getFieldProps('female_parents')}
                    error={Boolean(touched.female_parents && errors.female_parents)}
                    helperText={touched.female_parents && errors.female_parents}
                  />
                  <Typography variant="body1"> Photo Mempelai wanita</Typography>
                  <ImagePreview
                    sx={{ height: '120px' }}
                    loading="lazy"
                    src={femalePhoto && URL.createObjectURL(femalePhoto)}
                  />
                  <input
                    name="photo_female"
                    accept="image/*"
                    type="file"
                    onChange={(e) => onSelectImage(e, setFemalePhoto)}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ float: 'right', mt: 4 }}>
              <Button
                variant="contained"
                onClick={() => {
                  handleReset();
                  resetPhoto();
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
