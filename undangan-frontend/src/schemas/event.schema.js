import * as Yup from 'yup';
import { add, startOfDay } from 'date-fns';
import { isLatitude, isLongitude } from 'src/utils/helpers';

export const EVENT_INITIAL_START_TIME = add(new Date(), { days: 1 });
export const EVENT_INITIAL_END_TIME = add(new Date(), { days: 1, hours: 1 });

Yup.addMethod(Yup.string, 'coordinateType', function (errorMessage) {
  return this.test(`test-coordinate-type`, errorMessage, function (value) {
    const { path, createError } = this;

    if (value) {
      const coordinateArr = value.split(',');
      if (coordinateArr.length !== 2) {
        return createError({ path, message: errorMessage });
      }
      if (!isLatitude(coordinateArr[0]) || !isLongitude(coordinateArr[1])) {
        return createError({ path, message: errorMessage });
      }
    }
    return true;
  });
});

export const eventSchema = Yup.object().shape({
  name: Yup.string().required('Nama event wajib diisi'),
  location_name: Yup.string().required('Nama lokasi wajib diisi'),
  location_address: Yup.string().required('Alamat lokasi wajib diisi'),
  location_coordinate: Yup.string().coordinateType('Koordinat tidak valid'),
  time_start: Yup.date()
    .min(startOfDay(add(new Date(), { days: 1 })), 'Waktu mulai tidak valid')
    .required('Waktu wajib diisi'),
  time_end: Yup.date()
    .min(Yup.ref('time_start'), 'Waktu selesai tidak boleh kurang dari waktu mulai')
    .required('Waktu wajib diisi'),
});
