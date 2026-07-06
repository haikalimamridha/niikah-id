import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';
import useAppState from 'src/store/app.state';
import { queryClient } from 'src/App';

const feedBack = useFeedbackState.getState();

export const generateInvitationSite = async (invitationId) => {
  await Api().post(`invitations/${invitationId}/template/export`);
  feedBack.openSuccessFeedback('Undanganmu selesai di-generate');
};

export const deleteInvitation = async (id) => {
  const res = await Api().delete(`invitations/${id}`);
  feedBack.openSuccessFeedback('Undangan berhasil dihapus');
  return res;
};

export const createInvitation = async (body) => {
  const res = await Api().post('/v1/invitations', body, { headers: { 'Content-Type': 'multipart/form-data' } });
  feedBack.openSuccessFeedback('Undangan baru berhasil dibuat');
  return res;
};

export const updateInvitation = async (id, body) => {
  const res = await Api().patch(`/v1/invitations/${id}`, body, { headers: { 'Content-Type': 'multipart/form-data' } });
  feedBack.openSuccessFeedback('Undangan berhasil diperbaharui');
  queryClient.invalidateQueries(['userInvitations']);
  return res;
};

export const getLocalInvitationById = (id) => {
  const invitations = useAppState.getState().userInvitation;
  if (!invitations.length) return {};
  const current = invitations.find((inv) => inv.id === id);
  if (!current) return {};

  return current;
};
