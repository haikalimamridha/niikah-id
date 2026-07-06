import Api from 'src/utils/Api';
import useAuthState from 'src/store/auth.state';
import useFeedbackState from 'src/store/feedback.state';
import { getFormData } from 'src/utils/helpers';

const feedBack = useFeedbackState.getState();

export const updateUser = async (data) => {
  const body = getFormData(data);
  await Api().patch(`/auth/user`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
  feedBack.openSuccessFeedback('Profil berhasil diperbaharui');
  await useAuthState.getState().checkAuthRemotely();
};

export const updateProfilePicture = async (file) => {
  await updateUser({ photo: file });
};

export const updatePassword = async (data) => {
  await Api().patch('/auth/password', data);
  feedBack.openSuccessFeedback('Password berhasil diperbaharui');
};
