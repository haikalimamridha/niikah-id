import Api from 'src/utils/Api';
import useFeedbackState from 'src/store/feedback.state';
import { queryClient } from 'src/App';

const feedBack = useFeedbackState.getState();

export const uploadGallery = async (invitationId, imgFiles) => {
  try {
    if (!Array.isArray(imgFiles)) {
      return;
    }
    const body = new FormData();
    imgFiles.forEach((imgFile) => {
      body.append('photos', imgFile);
    });

    await Api().post(`/invitations/${invitationId}/galleries`, body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    feedBack.openSuccessFeedback('Berhasil menambahkan foto ke Galeri');
    queryClient.invalidateQueries(['galleries', invitationId]);
  } catch (error) {
    feedBack.openErrorFeedback('Galeri sudah mencapai batas atau gagal upload');
  }
};

export const getGalleries = async (invitationId) => {
  const { data } = await Api().get(`invitations/${invitationId}/galleries`);
  return data;
};

export const removeGallery = async (invitationId, galleryId) => {
  await Api().delete(`invitations/${invitationId}/galleries/${galleryId}`);
  feedBack.openSuccessFeedback('Foto berhasil dihapus dari Galeri');
  queryClient.invalidateQueries(['galleries', invitationId]);
};
