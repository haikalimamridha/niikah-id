import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import copyOutline from '@iconify/icons-eva/copy-outline';
import emailOutline from '@iconify/icons-eva/email-outline';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function GuestMoreMenu({ onEdit, onDelete, sendMessage, copyMessage }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete && onDelete();
    setIsOpen(false);
  };

  const handleEdit = () => {
    onEdit && onEdit();
    setIsOpen(false);
  };

  const onSendMessage = () => {
    sendMessage && sendMessage();
    setIsOpen(false);
  };

  const onCopyMessage = () => {
    copyMessage && copyMessage();
    setIsOpen(false);
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Hapus" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Ubah" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onCopyMessage}>
          <ListItemIcon>
            <Icon icon={copyOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Salin Pesan" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        <MenuItem sx={{ color: 'text.secondary' }} onClick={onSendMessage}>
          <ListItemIcon>
            <Icon icon={emailOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Kirim Pesan" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
    </>
  );
}

GuestMoreMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
