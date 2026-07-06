import { CSVLink } from 'react-csv';
import { Icon } from '@iconify/react';
import { useRef, useState, useMemo } from 'react';
import cloudDownload from '@iconify/icons-eva/cloud-download-outline';
import cloudUpload from '@iconify/icons-eva/cloud-upload-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import messageCircleOutline from '@iconify/icons-eva/message-circle-outline';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import useAppState from 'src/store/app.state';
import useFeedbackState from 'src/store/feedback.state';
import Api from 'src/utils/Api';

const csvHeaders = [
  { label: 'Nama', key: 'name' },
  { label: 'Kode Unik', key: 'code' },
  { label: 'Email', key: 'email' },
  { label: 'Nomor Whatsapp', key: 'wa_number' },
  { label: 'Kota/Alamat', key: 'address' },
];

// ----------------------------------------------------------------------

export default function GuestMoreMenu({ openCsvModal, invitationId, onBroadcastTemplate }) {
  const appState = useAppState();
  const ref = useRef(null);
  const csvRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const feedback = useFeedbackState();

  const currentPackage = useMemo(() => {
    const currentInvitation = appState.userInvitation.find((inv) => inv.id === invitationId);
    return appState.packages.find((pckg) => pckg.id === currentInvitation?.package_id);
  }, [appState, invitationId]);

  const exportCsv = async () => {
    setIsOpen(false);
    const response = await Api().get(`/invitations/${invitationId}/guests?limit=1000&sort_by=id&order_by=desc`);
    setCsvData(response.data.items);
    csvRef.current.link.click();
  };

  const openBroadcast = () => {
    if (!currentPackage.broadcast_template) {
      feedback.openWarningFeedback('Paketmu tidak mendukung fitur ini');
      return;
    }

    onBroadcastTemplate();
    setIsOpen(false);
  };

  const openCsv = () => {
    openCsvModal();
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
          sx: { width: 240, maxWidth: '100%' },
        }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={openCsv}>
          <ListItemIcon>
            <Icon icon={cloudUpload} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Upload CSV" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={exportCsv}>
          <ListItemIcon>
            <Icon icon={cloudDownload} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Expor ke CSV" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={openBroadcast}>
          <ListItemIcon>
            <Icon icon={messageCircleOutline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Template Broadcast" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>
      <CSVLink ref={csvRef} filename="daftar-tamu.csv" data={csvData} headers={csvHeaders} />
    </>
  );
}
