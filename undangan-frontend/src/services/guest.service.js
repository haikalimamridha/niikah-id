import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';

const feedBack = useFeedbackState.getState();

export const addGuest = async ({ invitationId, values }) => {
  const { data } = await Api().post(`/invitations/${invitationId}/guests`, values);
  feedBack.openSuccessFeedback('Berhasil menambahkan tamu');
  return data;
};

export const editGuest = async ({ invitationId, values, id }) => {
  const { data } = await Api().patch(`/invitations/${invitationId}/guests/${id}`, values);
  feedBack.openSuccessFeedback('Berhasil merubah tamu');
  return data;
};

export const getGuestById = async ({ invitationId, id }) => {
  const { data } = await Api().get(`/invitations/${invitationId}/guests/${id}`);
  return data;
};

export const getGuests = ({ invitationId, params }) => {
  return Api().get(`/invitations/${invitationId}/guests`, { params });
};

export const deleteMultipleGuest = async ({ invitationId, ids }) => {
  await Api().post(`/invitations/${invitationId}/guests/delete`, { guestIds: ids });
  feedBack.openSuccessFeedback(`Berhasil menghapus tamu terpilih`);
};
