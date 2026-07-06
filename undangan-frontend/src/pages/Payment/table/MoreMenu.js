import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import cloudUploadOutline from '@iconify/icons-eva/cloud-upload-outline';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import useFeedbackState from 'src/store/feedback.state';

const feedBack = useFeedbackState.getState();

// ----------------------------------------------------------------------
export default function PaymentMoreMenu({ onUploadClick, item }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onUploadTrigger = () => {
    if (!item.invitation_id) {
      feedBack.openErrorFeedback('Undangan sudah dihapus');
      setIsOpen(false);
      return;
    }

    if (Boolean(item.receipt_proof)) {
      feedBack.openInfoFeedback('Bukti pembaran sudah di upload');
      setIsOpen(false);
      return;
    }

    onUploadClick && onUploadClick(item.invitation_id);
    setIsOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)} disabled={item.is_paid}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 260, maxWidth: '100%' },
        }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={onUploadTrigger}>
          <ListItemIcon>
            <Icon icon={cloudUploadOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Upload Bukti Pembayaran" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

PaymentMoreMenu.propTypes = {
  onDelete: PropTypes.func,
};
