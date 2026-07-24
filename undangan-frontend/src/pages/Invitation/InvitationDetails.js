import find from 'lodash-es/find';
import { Icon } from '@iconify/react';
import { useQueryClient, useMutation } from 'react-query';
import { useState, useMemo, Fragment, useRef, useEffect } from 'react';
import {
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Grid,
  FormControl,
  Select,
  InputLabel,
  FormHelperText,
  MenuItem,
  IconButton,
  Tooltip,
  Portal,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ConfirmDialog from 'src/components/ConfirmDialog';
import { Form, FormikProvider, useFormik } from 'formik';
import ImagePreview from 'src/components/ImagePreview';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import externalLinkOutline from '@iconify/icons-eva/external-link-outline';
import syncOutline from '@iconify/icons-eva/sync-outline';
import bookOpenOutline from '@iconify/icons-eva/book-open-outline';
import { generateInvitationSite, deleteInvitation } from 'src/services/invitation.service';
import { editInvitationSchema } from 'src/schemas/invitation.schema';
import { updateInvitation } from 'src/services/invitation.service';
import { fDate } from 'src/utils/formatTime';
import useAppState from 'src/store/app.state';
import QuoteModal from './QuoteModal';
import { getInvitationPackage } from 'src/services/package.service';
import { onSelectImage, assetsRemoteUrl, isSubdomaiAvailable, getFormData, onSelectSong } from 'src/utils/helpers';
import ArrowDownIos from '@iconify/icons-eva/arrow-ios-downward-outline';
import Label from 'src/components/Label';

export default function InvitationDetails({ data }) {
  const queryClient = useQueryClient();
  const [malePhoto, setMalePhoto] = useState();
  const [femalePhoto, setFemalePhoto] = useState();
  const [photoMain, setPhotoMain] = useState();
  const [bgMusic, setBgMusic] = useState();
  const [confirm, setConfirm] = useState(false);
  const [quoteModal, setQuoteModal] = useState(false);
  const templates = useAppState((state) => state.templates);
  const deleteMutation = useMutation(deleteInvitation, {
    onSuccess: () => {
      // update cache
      queryClient.invalidateQueries('userInvitations');
      useAppState.getState().getUserInvitation();
    },
  });

  const formik = useFormik({
    initialValues: {
      title: data?.content?.title || '',
      subdomain: data?.subdomain || '',
      template_name: data?.template_name || '',

      package_id: data?.package_id || '', // tambahan
      
      url_youtube: data?.url_youtube || '',
      male_name: data?.content?.male_name || '',
      female_name: data?.content?.female_name || '',
      male_parents: data?.content?.male_parents || '',
      female_parents: data?.content?.female_parents || '',
      male_nickname: data?.content?.male_nickname || '',
      female_nickname: data?.content?.female_nickname || '',
      malePhoto: data?.content?.url_photo_male || "", // tambahan
      femalePhoto: data?.content?.url_photo_female || "", //tambahan
    },
    validationSchema: editInvitationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (values.subdomain !== data?.subdomain) {
          const isSubdomainOk = await isSubdomaiAvailable(values.subdomain);
          if (!isSubdomainOk) {
            setFieldError('subdomain', 'subdomain tidak tersedia !');
            return;
          }
        }
        const body = getFormData({
          ...values,
          photo_male: malePhoto,
          photo_female: femalePhoto,
          photo_main: photoMain,
          bg_music: bgMusic,
        });

        await updateInvitation(data?.id, body);
      } catch (error) {
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    handleBlur,
    handleChange,
    setFieldError,
    isSubmitting,
    handleReset,
    dirty,
  } = formik;

  const currentPackage = getInvitationPackage(data.package_id);

  const previewUrl = useMemo(() => {
    const activeTemp = find(templates, { name: values.template_name });
    if (activeTemp) {
      return assetsRemoteUrl(activeTemp.preview);
    }

    return null;
  }, [values, templates]);

  const openInvitationSite = (e) => {
    e.stopPropagation();
    // window.open(`https://${data?.subdomain}.niikah.id`, '_blank');
    const activeTemp = find(templates, { name: values.template_name });
      if (activeTemp) {
        window.open(assetsRemoteUrl(activeTemp.preview), '_blank');
      }
  };

  const renderMusicFileLabel = () => {
    if (data?.content?.url_bg_music) {
      return (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {data?.content?.url_bg_music}
        </Typography>
      );
    } else if (data?.content?.url_bg_music && bgMusic?.name) {
      return (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {bgMusic?.name}
        </Typography>
      );
    }
  };

  const isExpired = data?.expired_at ? new Date() > new Date(data.expired_at) : false;
  const iframeRef = useRef(null);

  // cobaaaa
  useEffect(() => {
    if (!iframeRef.current) return;

    iframeRef.current.contentWindow.postMessage(
      {
        title: values.title,
        male_name: values.male_name,
        female_name: values.female_name,
        male_parents: values.male_parents,
        female_parents: values.female_parents,
        male_nickname: values.male_nickname,
        female_nickname: values.female_nickname,

        url_photo_male:
          malePhoto
            ? URL.createObjectURL(malePhoto)
            : assetsRemoteUrl(values.url_photo_male),

        url_photo_female:
          femalePhoto
            ? URL.createObjectURL(femalePhoto)
            : assetsRemoteUrl(values.url_photo_female),

        event_date: values.event_date,
        address: values.address,
        map_embed: values.map_embed,
      },
      "*"
    );
  }, [values, malePhoto, femalePhoto]);

  return (
    <Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<Icon icon={ArrowDownIos} />} aria-controls="panel1a-content" id="panel1a-header">
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center" sx={{ width: '95%' }}>
            <Typography variant="h5" gutterBottom color="primary.main">
              Undangan {data.content.title}
            </Typography>
            <Stack flexDirection="row" alignItems="center">
              {isExpired && (
                <Label variant="filled" color="warning" sx={{ mr: 3 }}>
                  Undangan Sudah Kadaluarsa
                </Label>
              )}
              <Tooltip title="Buka Site Undangan">
                <IconButton sx={{ mr: 2 }} onClick={openInvitationSite} disabled={!data.is_active || isExpired}>
                  <Icon icon={externalLinkOutline} width={25} height={25} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Site Undangan">
                <IconButton
                  sx={{ mr: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    generateInvitationSite(data?.id);
                  }}
                  disabled={!data.is_active || isExpired}
                >
                  <Icon icon={syncOutline} width={25} height={25} />
                </IconButton>
              </Tooltip>
              {currentPackage.quote && (
                <Tooltip title="Quote Undangan">
                  <IconButton
                    sx={{ mr: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuoteModal(true);
                    }}
                    disabled={!data.is_active || isExpired}
                  >
                    <Icon icon={bookOpenOutline} width={25} height={25} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Hapus undangan ini">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirm(true);
                  }}
                >
                  <Icon icon={trash2Outline} width={25} height={25} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Card>
            <FormikProvider value={formik}>
              <Form onSubmit={handleSubmit}>
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid item xs={12} lg={6}>
                      <Stack direction="row" alignItems="center">
                        <TextField
                          fullWidth
                          label="Subdomain"
                          {...getFieldProps('subdomain')}
                          error={Boolean(touched.subdomain && errors.subdomain)}
                          helperText={touched.subdomain && errors.subdomain}
                        />
                        <Typography color="primary" sx={{ ml: 4 }}>
                          .niikah.id
                        </Typography>
                      </Stack>
                      <Stack spacing={3} mt={3}>
                        <TextField
                          fullWidth
                          label="Judul Undangan"
                          {...getFieldProps('title')}
                          error={Boolean(touched.title && errors.title)}
                          helperText={touched.title && errors.title}
                        />
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
                        <TextField fullWidth label="Undangan berlaku sampai" disabled value={fDate(data?.expired_at)} />
                        {currentPackage.youtube_link && (
                          <TextField
                            fullWidth
                            label="Link Youtube"
                            {...getFieldProps('url_youtube')}
                            error={Boolean(touched.url_youtube && errors.url_youtube)}
                            helperText={touched.url_youtube && errors.url_youtube}
                          />
                        )}
                        {currentPackage.music_background && (
                          <Box>
                            <Typography variant="subtitle1" mb={2}>
                              Latar Belakang musik undangan
                            </Typography>
                            {renderMusicFileLabel()}
                            <input type="file" accept="audio/*" onChange={(e) => onSelectSong(e, setBgMusic)} />
                          </Box>
                        )}
                        <Typography variant="subtitle1"> Photo Utama </Typography>
                        <ImagePreview
                          loading="lazy"
                          src={
                            (photoMain && URL.createObjectURL(photoMain)) ||
                            (data?.content?.url_photo_main && assetsRemoteUrl(data?.content?.url_photo_main))
                          }
                        />
                        <input
                          name="photo_main "
                          accept="image/*"
                          type="file"
                          onChange={(e) => onSelectImage(e, setPhotoMain)}
                        />
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} lg={6}>
                      <Typography variant="h6" gutterBottom> 
                        Preview Undangan
                      </Typography>
                      <ImagePreview sx={{ width: '100%', height: 580 }} loading="lazy" src={previewUrl} /> #diganti dari image preview menjadi iframe(html)
                    </Grid> */}
                    <Grid item xs={12} lg={6}>
                      <Typography variant="h6" gutterBottom>
                        Preview Undangan
                      </Typography>
                      <Box
                        sx={{
                          width: '100%',
                          height: 580,
                          border: '1px solid #ddd',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {previewUrl && (
                          <iframe
                            title="Preview Template"
                            ref={iframeRef} //tambahan coba
                            src={previewUrl}
                            width="100%"
                            height="100%"
                            style={{
                              border: 'none',
                            }}
                                onLoad={() => {
                                  iframeRef.current?.contentWindow?.postMessage({
                                      ...values,
                                      url_photo_male:
                                          malePhoto
                                              ? URL.createObjectURL(malePhoto)
                                              : assetsRemoteUrl(values.url_photo_male),

                                      url_photo_female:
                                          femalePhoto
                                              ? URL.createObjectURL(femalePhoto)
                                              : assetsRemoteUrl(values.url_photo_female),
                                  }, "*");
                              }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ marginTop: 4 }} />
                  <Grid container mt={2} spacing={4}>
                    {/* <Grid item xs={12} lg={6} spacing={3}> diubah krn error */}
                    <Grid item xs={12} lg={6}>
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                          Mempelai Pria
                        </Typography>
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
                          {...getFieldProps('male_parents')}
                          error={Boolean(touched.male_parents && errors.male_parents)}
                          helperText={touched.male_parents && errors.male_parents}
                        />
                        <Typography variant="subtitle1"> Photo Mempelai laki-laki</Typography>
                        <ImagePreview
                          loading="lazy"
                          src={
                            (malePhoto && URL.createObjectURL(malePhoto)) ||
                            (data?.content?.url_photo_male && assetsRemoteUrl(data?.content?.url_photo_male))
                          }
                        />
                        <input
                          name="photo_male "
                          accept="image/*"
                          type="file"
                          onChange={(e) => onSelectImage(e, setMalePhoto)}
                        />
                      </Stack>
                    </Grid>
                    {/* <Grid item xs={12} lg={6} spacing={3}> //diubah krn error*/}
                    <Grid item xs={12} lg={6} >
                      <Stack spacing={3}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
                          Mempelai Wanita
                        </Typography>
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
                          {...getFieldProps('female_parents')}
                          error={Boolean(touched.female_parents && errors.female_parents)}
                          helperText={touched.female_parents && errors.female_parents}
                        />
                        <Typography variant="subtitle1"> Photo Mempelai wanita</Typography>
                        <ImagePreview
                          loading="lazy"
                          src={
                            (femalePhoto && URL.createObjectURL(femalePhoto)) ||
                            (data?.content?.url_photo_female && assetsRemoteUrl(data?.content?.url_photo_female))
                          }
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
                </CardContent>
                <CardActions sx={{ float: 'right', padding: 4 }}>
                  <Button variant="contained" color="error" sx={{ marginRight: 2 }} onClick={handleReset}>
                    Batal
                  </Button>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    loading={isSubmitting}
                    // disabled={(!dirty && !malePhoto && !femalePhoto && !bgMusic) || isExpired}
                    disabled={!dirty && !malePhoto && !femalePhoto && !bgMusic}
                  >
                    Simpan Perubahan
                  </LoadingButton>
                </CardActions>
              </Form>
            </FormikProvider>
          </Card>
        </AccordionDetails>
      </Accordion>
      <Portal>
        <ConfirmDialog
          isOpen={confirm}
          onClose={() => setConfirm(false)}
          onConfirm={() => deleteMutation.mutate(data.id)}
          title="Apakah kamu yakin ?"
          text="Undangan ini akan dihapus secara permanen"
        />
        <QuoteModal item={data} isOpen={quoteModal} onClose={() => setQuoteModal(false)} />
      </Portal>
    </Fragment>
  );
}