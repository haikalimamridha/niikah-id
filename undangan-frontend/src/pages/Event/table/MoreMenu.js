import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import toggleLeftOutline from '@iconify/icons-eva/toggle-left-outline';
import toggleRightOutline from '@iconify/icons-eva/toggle-right-outline';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { updateEvent } from 'src/services/event.service';

// ----------------------------------------------------------------------

export default function TableMoreMenu({ item, onEdit, onDelete, isPrimaryAvailable }) {
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

  const toggleEventStatus = (status) => {
    updateEvent({ invitationId: item.invitation_id, id: item.id, body: { is_primary: status } });
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
          sx: { width: 250, maxWidth: '100%' },
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
        {!item.is_primary && !isPrimaryAvailable && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => toggleEventStatus(true)}>
            <ListItemIcon>
              <Icon icon={toggleLeftOutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Jadikan acara utama" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
        {item.is_primary && (
          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => toggleEventStatus(false)}>
            <ListItemIcon>
              <Icon icon={toggleRightOutline} width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary="Jadikan acara Sekunder" primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

TableMoreMenu.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
