import { useMemo } from 'react';
import { find } from 'lodash-es';
import { useQuery } from 'react-query';
import { Form, useFormik, FormikProvider } from 'formik';
import {
  Typography,
  Stack,
  TextField,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  FormHelperText,
} from '@mui/material';
import useWizardState from 'src/store/wizard.state';
import { styled } from '@mui/material/styles';
import StepFormWraper from './StepFormWraper';
import StepNavigator from './StepNavigator';
import config from 'src/constants/config';
import Api from 'src/utils/Api';
import { fRupiah } from 'src/utils/formatNumber';
import { websiteWizardSchema } from 'src/schemas/invitation.schema';

const ImagePreview = styled('img')(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  height: 460,
  objectFit: 'cover',
}));

export default function WebsiteForm() {
  const { prevForm, nextForm, setInvitationForm, ...wizardState } = useWizardState();
  const { data: packageFetch } = useQuery('packageLists', () => Api().get('/packages'));
  const { data: templateFetch } = useQuery('templateLists', () => Api().get('/templates'));

  const formik = useFormik({
    initialValues: {
      title: wizardState.title,
      subdomain: wizardState.subdomain,
      package_id: wizardState.package_id,
      template_name: wizardState.template_name,
    },
    validationSchema: websiteWizardSchema,

    onSubmit: async (values, { setSubmitting }) => {
      const message = await subdomainCheck(values.subdomain);
      if (message) return;
      setInvitationForm(values);
      setSubmitting(false);
      nextForm();
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    getFieldProps,
    submitForm,
    isValid,
    handleBlur,
    handleChange,
    setFieldError,
  } = formik;

  const subdomainCheck = async (subdomain) => {
    try {
      await Api().post('/validate/subdomain', { subdomain });
    } catch (err) {
      if (err.response) {
        setFieldError('subdomain', 'subdoamin tidak tersedia !');
        return err.response.data.message;
      }
    }
  };

  const previewUrl = useMemo(() => {
    const activeTemp = find(templateFetch?.data?.items, { name: values.template_name });
    if (activeTemp) {
      return `${config.SERVICE_BASE_URL}/${activeTemp.screenshoot}`;
    }

    return null;
  }, [values, templateFetch]);

  const pckgDescription = useMemo(() => {
    const activePckg = find(packageFetch?.data?.items, { id: values.package_id });
    if (activePckg) {
      return activePckg.description;
    }

    return null;
  }, [values, packageFetch]);

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <StepFormWraper>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6} mt={4}>
              <Stack direction="row" alignItems="center">
                <TextField
                  fullWidth
                  label="Subdomain"
                  {...getFieldProps('subdomain')}
                  error={Boolean(touched.subdomain && errors.subdomain)}
                  helperText={touched.subdomain && errors.subdomain}
                />
                <Typography sx={{ ml: 4 }}>.niika.id</Typography>
              </Stack>
              <Stack spacing={3} mt={3}>
                <TextField
                  fullWidth
                  label="Judul Undangan"
                  {...getFieldProps('title')}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
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
                    {packageFetch?.data?.items?.map((pckg, i) => (
                      <MenuItem key={i} value={pckg.id}>{`${pckg.name} - ${fRupiah(pckg.price)}`}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.package_id && errors.package_id}</FormHelperText>
                </FormControl>
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
                    {templateFetch?.data?.items?.map((template, i) => (
                      <MenuItem key={i} value={template.name}>
                        {template.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{touched.template_name && errors.template_name}</FormHelperText>
                </FormControl>
                <TextField fullWidth multiline minRows={3} maxRows={4} disabled value={pckgDescription} />
              </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="h6" gutterBottom>
                Preview Undangan
              </Typography>
              <Paper>
                <ImagePreview loading="lazy" src={previewUrl} />
              </Paper>
            </Grid>
          </Grid>
        </StepFormWraper>
        <StepNavigator onBack={prevForm} onNext={submitForm} disabledNext={!isValid} />
      </Form>
    </FormikProvider>
  );
}
