import { escapeRegExp } from 'lodash-es';
import Api from './Api';
import config from 'src/constants/config';
import useFeedbackState from 'src/store/feedback.state';
import * as mimeTypes from 'src/constants/mimeTypes';

export const onSelectImage = (event, setState) => {
  if (event.target.files && event.target.files[0]) {
    const img = event.target.files[0];
    if (!img.type.startsWith('image')) {
      useFeedbackState.getState().openWarningFeedback('Format foto tidak sesuai');
      return;
    }
    if (img.size / 1024 / 1024 > 2.9) {
      useFeedbackState.getState().openWarningFeedback('File tidak boleh lebih dari 3 MB');
      return;
    }
    setState(img);
  } else {
    setState(null);
  }
};

export const onSelectSong = (event, setState) => {
  if (event.target.files && event.target.files[0]) {
    const song = event.target.files[0];
    if (song.type !== 'audio/mpeg') {
      useFeedbackState.getState().openWarningFeedback('Format lagu tidak sesuai');
      return;
    }
    if (song.size / 1024 / 1024 > 2.9) {
      useFeedbackState.getState().openWarningFeedback('File tidak boleh lebih dari 3 MB');
      return;
    }
    setState(song);
  } else {
    setState(null);
  }
};

export const onSelectCsv = (e, setState) => {
  if (e.target.files && e.target.files[0]) {
    const csv = e.target.files[0];
    if (!mimeTypes.csv.includes(csv.type)) {
      useFeedbackState.getState().openWarningFeedback('Format CSV tidak valid');
      return;
    }
    if (csv.size / 1024 / 1024 > 0.5) {
      useFeedbackState.getState().openWarningFeedback('File CSV terlalu besar');
      return;
    }
    setState(csv);
  } else {
    setState(null);
  }
};

export const assetsRemoteUrl = (assetUrl) => `${config.API_BASE_URL}/v1/${assetUrl}`;

export const isSubdomaiAvailable = async (subdomain) => {
  try {
    await Api().post('/v1/validate/subdomain', { subdomain });
    return true;
  } catch (error) {
    return false;
  }
};

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    Boolean(object[key]) && formData.append(key, object[key]);
  });
  return formData;
};

export const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
};

export const copyToClipBoard = async (text) => {
  await navigator.clipboard.writeText(text);
  useFeedbackState.getState().openSuccessFeedback('Berhasil tersalin ke clipboard');
};

export function isLatitude(lat) {
  return isFinite(lat) && Math.abs(lat) <= 90;
}

export function isLongitude(lng) {
  return isFinite(lng) && Math.abs(lng) <= 180;
}
