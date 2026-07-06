import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';
import { getFormData } from 'src/utils/helpers';

const feedBack = useFeedbackState.getState();

export const getMyInvoices = async () => {
  return Api().get('/invoices/my-invoice?sort_by=id&order_by=desc');
};

export const uploadReceipt = async (invitationId, file) => {
  const body = getFormData({
    receipt: file,
  });

  await Api().post(`/invitations/${invitationId}/invoice/receipt`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  feedBack.openSuccessFeedback('Berhasil mengupload bukti pembayaran');
};
