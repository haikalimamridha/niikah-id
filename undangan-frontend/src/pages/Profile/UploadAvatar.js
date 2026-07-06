import React, { useRef } from 'react';
import { Avatar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import account from 'src/_mocks_/account';
import Icon from '@iconify/react';
import cameraOutline from '@iconify/icons-eva/camera-outline';
import { assetsRemoteUrl, onSelectImage } from 'src/utils/helpers';
import useAuthState from 'src/store/auth.state';
import { updateProfilePicture } from 'src/services/user.service';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  position: 'relative',
  [theme.breakpoints.down('lg')]: {
    margin: 'auto',
  },
}));

const UploadAvatar = () => {
  const fileInputRef = useRef();
  const user = useAuthState((state) => state.user);

  const onUploadFiles = (file) => {
    file && updateProfilePicture(file);
  };

  return (
    <StyledAvatar alt="profile-avatar">
      <img
        alt="profile-avatar"
        src={(user.photo && assetsRemoteUrl(user.photo)) || account.photoURL}
        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
      />
      <Box
        onClick={() => fileInputRef.current.click()}
        sx={{
          zIndex: 999,
          padding: '6px',
          backgroundColor: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          bottom: 0,
          right: 14,
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        <Icon icon={cameraOutline} width={16} height={16} color="#000" />
        <input
          ref={fileInputRef}
          name="profile_photo"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => onSelectImage(e, onUploadFiles)}
        />
      </Box>
    </StyledAvatar>
  );
};

export default UploadAvatar;
