import { Icon } from '@iconify/react';
import { Box, Tooltip, IconButton } from '@mui/material';
import trash2 from '@iconify/icons-eva/trash-2-fill';
import { assetsRemoteUrl } from 'src/utils/helpers';
import { removeGallery } from 'src/services/gallery.service';

const GalleryBoxViewer = (props) => {
  const onRemoveImg = async () => {
    await removeGallery(props.invitationId, props.id);
  };

  return (
    <Box
      sx={{
        width: '200px',
        height: '200px',
        maxWidth: '200px',
        borderRadius: '12px',
        // border: (theme) => `1px solid ${theme.palette.primary.main}`,
        backgroundSize: 'cover',
        position: 'relative',
        marginRight: '20px',
        marginBottom: '20px',
        backgroundImage: `url("${assetsRemoteUrl(props.url_photo)}")`,
      }}
    >
      <Box
        sx={{
          // backgroundColor: '#fff',
          height: '40px',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '0 5px',
        }}
      >
        <Tooltip title="Hapus Foto">
          <IconButton onClick={onRemoveImg}>
            <Icon icon={trash2} width={20} height={20} color="#fff" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default GalleryBoxViewer;
