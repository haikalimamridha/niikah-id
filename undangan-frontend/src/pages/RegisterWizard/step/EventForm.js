import { add, isEqual } from 'date-fns';
import { Stack, TextField, Grid } from '@mui/material';
import StepFormWraper from './StepFormWraper';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { useFormik, Form, FormikProvider } from 'formik';
import TimePicker from '@mui/lab/TimePicker';
import StepNavigator from './StepNavigator';
import useWizardState from 'src/store/wizard.state';
import { eventSchema } from 'src/schemas/event.schema';

const INITIAL_START_TIME = add(new Date(), { days: 1 });
const INITIAL_END_TIME = add(new Date(), { days: 1, hours: 1 });

export default function EventForm() {
  const { setSubeventForm, nextForm, prevForm, subevent } = useWizardState();

  const formik = useFormik({
    initialValues: {
      name: subevent.name,
      location_name: subevent.location_name,
      location_coordinate: subevent.location_coordinate,
      location_address: subevent.location_address,
      time_start: subevent.time_start || INITIAL_START_TIME,
      time_end: subevent.time_end || INITIAL_END_TIME,
    },
    validationSchema: eventSchema,
    onSubmit: (values, { setSubmitting }) => {
      // handle same time start & end (Should moved to yup)
      if (isEqual(values.time_start, values.time_end)) {
        setFieldError('time_end', 'Waktu selesai tidak boleh sama dengan waktu mulai');
        return;
      }
      setSubeventForm(values);
      setSubmitting(false);
      nextForm();
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps, submitForm, isValid, setFieldValue, setFieldError } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <StepFormWraper>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10}>
              <Stack spacing={3}>
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
                    minDate={INITIAL_START_TIME}
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
            </Grid>
          </Grid>
        </StepFormWraper>
        <StepNavigator onNext={submitForm} onBack={prevForm} disabledNext={!isValid} />
      </Form>
    </FormikProvider>
  );
}
