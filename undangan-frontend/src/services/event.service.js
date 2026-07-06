import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';
import { queryClient } from 'src/App';

const feedBack = useFeedbackState.getState();

export const updateEvent = async ({ invitationId, id, body }) => {
  await Api().patch(`invitations/${invitationId}/subevents/${id}`, body);
  feedBack.openSuccessFeedback('Berhasil mengupdate acara');
  queryClient.invalidateQueries(['events', invitationId]);
};
