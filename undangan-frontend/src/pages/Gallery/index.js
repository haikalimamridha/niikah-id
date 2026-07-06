import { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Icon } from '@iconify/react';
import { Container, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import cameraFill from '@iconify/icons-eva/camera-fill';

import Page from 'src/components/Page';
import useAppState from 'src/store/app.state';
import SelectInvitation from 'src/components/SelectInvitation';
import { onSelectImage } from 'src/utils/helpers';
import { uploadGallery } from 'src/services/gallery.service';
import { getGalleries } from 'src/services/gallery.service';
import AddPhotoBox from 'src/components/AddPhotoBox';
import GalleryBoxViewer from 'src/components/GalleryBoxViewer';

const WrapedAddIcon = styled(Icon)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export default function Guest() {
  const fileInputRef = useRef();
  const userInvitation = useAppState((state) => state.userInvitation);
  const [invitationId, setInvitationId] = useState(userInvitation[0]?.id || '');
  const { data } = useQuery(['galleries', invitationId], () => getGalleries(invitationId));

  const uploadImg = async (imgFile) => {
    if (imgFile) {
      await uploadGallery(invitationId, [imgFile]);
    }
  };

  return (
    <Page title="Daftar Tamu | niikah.id">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Galeri Foto
          </Typography>
          <Stack direction="row" alignItems="center">
            <SelectInvitation value={invitationId} onChange={setInvitationId} />
          </Stack>
        </Stack>
        <Stack mt={2} flexDirection="row" flexWrap="wrap">
          <AddPhotoBox onClick={() => fileInputRef.current.click()}>
            <WrapedAddIcon icon={cameraFill} width={40} height={40} />
            <Typography mt={2} variant="h6" color="text.secondary">
              Add Photo
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => onSelectImage(e, uploadImg)}
            />
          </AddPhotoBox>
          {data?.items?.map((item, i) => (
            <GalleryBoxViewer key={i} invitationId={invitationId} {...item} />
          ))}
        </Stack>
      </Container>
    </Page>
  );
}
